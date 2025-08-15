import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerNote, LoreEntryData, MindMapLayout } from '../types';
import InteractiveText from './InteractiveText';

// --- PROPS INTERFACE ---
interface PlayerNotesModalProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  isOpen: boolean;
  onClose: () => void;
  notes: PlayerNote[];
  loreEntries: LoreEntryData[];
  layout: MindMapLayout;
  onLayoutChange: (layout: MindMapLayout) => void;
  onAddNote: (noteData: { title: string; content: string; }) => void;
  onUpdateNote: (note: PlayerNote) => void;
  onDeleteNote: (id: string) => void;
}

// --- NODE COMPONENT ---
interface NodeProps {
    id: string;
    type: 'note' | 'lore';
    title: string;
    content: string;
    position: { x: number, y: number };
    onDragStart: (e: React.MouseEvent, id: string) => void;
    onLinkStart: (e: React.MouseEvent, id: string, handleRef: React.RefObject<HTMLDivElement>) => void;
}
const MindMapNode: React.FC<NodeProps> = React.memo(({ id, type, title, content, position, onDragStart, onLinkStart }) => {
    const linkHandleRef = useRef<HTMLDivElement>(null);
    return (
        <div
            className={`mind-map-node type-${type}`}
            style={{ left: position.x, top: position.y }}
            onMouseDown={(e) => {
                if (e.target !== linkHandleRef.current) {
                    onDragStart(e, id);
                }
            }}
        >
            <h5>{title}</h5>
            <p>{content.substring(0, 100) + (content.length > 100 ? '...' : '')}</p>
            <div
                ref={linkHandleRef}
                className="link-handle"
                onMouseDown={(e) => onLinkStart(e, id, linkHandleRef)}
            />
        </div>
    );
});

// --- MAIN COMPONENT ---
const PlayerNotesModal: React.FC<PlayerNotesModalProps> = ({
  t, isOpen, onClose, notes, loreEntries, layout, onLayoutChange,
  onAddNote, onUpdateNote, onDeleteNote
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging state for nodes
  const [dragState, setDragState] = useState<{ id: string; offset: { x: number, y: number } } | null>(null);
  
  // Linking state
  const [linkState, setLinkState] = useState<{ from: string; fromHandle: DOMRect; to: { x: number, y: number } } | null>(null);

  // Editor State
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDragState(null);
      setLinkState(null);
      setIsEditing(false);
      setCurrentNoteId(null);
    } else {
        // Add default positions for any new nodes that don't have one
        const allNodes = [...notes.map(n => ({ id: `note_${n.id}`})), ...loreEntries.map(l => ({ id: `lore_${l.id}`}))];
        const newPositions = { ...layout.positions };
        let changed = false;
        allNodes.forEach((node, i) => {
            if (!newPositions[node.id]) {
                newPositions[node.id] = { x: 50 + (i % 8) * 30, y: 50 + Math.floor(i / 8) * 150 };
                changed = true;
            }
        });
        if (changed) {
            onLayoutChange({ ...layout, positions: newPositions });
        }
    }
  }, [isOpen, notes, loreEntries]);

  // --- Drag and Link Handlers ---
  const handleNodeDragStart = useCallback((e: React.MouseEvent, id: string) => {
      e.preventDefault();
      const pos = layout.positions[id];
      setDragState({ id, offset: { x: e.clientX - pos.x, y: e.clientY - pos.y } });
  }, [layout.positions]);

  const handleLinkStart = useCallback((e: React.MouseEvent, id: string, handleRef: React.RefObject<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!handleRef.current) return;
      const fromHandle = handleRef.current.getBoundingClientRect();
      setLinkState({ from: id, fromHandle, to: { x: e.clientX, y: e.clientY } });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (dragState && canvasRef.current) {
          const newX = e.clientX - dragState.offset.x;
          const newY = e.clientY - dragState.offset.y;
          onLayoutChange({
              ...layout,
              positions: { ...layout.positions, [dragState.id]: { x: newX, y: newY } }
          });
      }
      if (linkState) {
          setLinkState(prev => prev ? { ...prev, to: { x: e.clientX, y: e.clientY } } : null);
      }
  }, [dragState, linkState, layout, onLayoutChange]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
      if (linkState) {
          const targetElement = document.elementFromPoint(e.clientX, e.clientY);
          const targetNode = targetElement?.closest('.mind-map-node');
          const targetId = targetNode?.getAttribute('data-id');
          if (targetId && targetId !== linkState.from) {
              const newLink = { from: linkState.from, to: targetId };
              // Avoid duplicate links
              if (!layout.links.some(l => (l.from === newLink.from && l.to === newLink.to) || (l.from === newLink.to && l.to === newLink.from))) {
                  onLayoutChange({ ...layout, links: [...layout.links, newLink] });
              }
          }
      }
      setDragState(null);
      setLinkState(null);
  }, [linkState, layout, onLayoutChange]);

  // --- Editor Logic ---
  const handleEditNote = (note: PlayerNote) => {
      setIsEditing(true);
      setCurrentNoteId(note.id);
      setNoteTitle(note.title);
      setNoteContent(note.content);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const finalTitle = noteTitle.trim() || `${t("New Entry")} - ${new Date().toLocaleDateString()}`;
    
    if (isEditing && currentNoteId) {
        onUpdateNote({ id: currentNoteId, title: finalTitle, content: noteContent, timestamp: new Date().toISOString() });
    } else {
        onAddNote({ title: finalTitle, content: noteContent });
    }
    setNoteTitle('');
    setNoteContent('');
    setCurrentNoteId(null);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  // --- Render Logic ---
  const allNodes = [
    ...notes.map(n => ({ id: `note_${n.id}`, type: 'note' as const, title: n.title, content: n.content })),
    ...loreEntries.map(l => ({ id: `lore_${l.id}`, type: 'lore' as const, title: l.title, content: l.content }))
  ];

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fadeIn"
      onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="player-notes-title" tabIndex={-1}
    >
      <div
        className="modal-content-area bg-secondary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col modal-content-enter-active"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="player-notes-title" className="font-heading text-3xl text-heading-color echoic-unveil-title">
            {t("The Weaver's Journal & Mind Map")}
          </h2>
          <button onClick={onClose} className="fantasy-button fantasy-button-secondary p-2 text-sm">{t("Close Journal")}</button>
        </div>

        <div className="mind-map-grid flex-grow">
          {/* Sidebar */}
          <div className="mind-map-sidebar custom-scrollbar overflow-y-auto">
             <form onSubmit={handleFormSubmit} className="mb-4 p-2 bg-primary rounded-md border border-divider-color">
                <h3 className="font-heading text-xl text-accent-primary mb-2">{isEditing ? t("Edit Entry") : t("New Entry")}</h3>
                <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder={t("Title (Optional):")} className="w-full p-2 mb-2 border border-divider-color rounded bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color" />
                <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} rows={4} required placeholder={t("Content:")} className="w-full p-2 mb-2 border border-divider-color rounded bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color custom-scrollbar" />
                <div className="flex gap-2">
                    <button type="submit" className="fantasy-button fantasy-button-primary flex-grow">{isEditing ? t("Save Changes") : t("Add Note")}</button>
                    {isEditing && <button type="button" onClick={() => { setIsEditing(false); setCurrentNoteId(null); setNoteTitle(''); setNoteContent('')}} className="fantasy-button fantasy-button-secondary">{t("Cancel")}</button>}
                </div>
            </form>
            <div className="flex-grow">
                <h3 className="font-heading text-lg text-accent-primary mt-2">{t("All Notes")}</h3>
                <ul className="space-y-1">
                    {notes.map(note => (
                        <li key={note.id} className="p-1.5 rounded bg-primary text-sm flex justify-between items-center">
                            <span className="truncate">{note.title}</span>
                            <div className="flex gap-1">
                                <button onClick={() => handleEditNote(note)} className="text-xs hover:text-accent-primary">Edit</button>
                                <button onClick={() => onDeleteNote(note.id)} className="text-xs hover:text-magical-error-text">Del</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          {/* Canvas */}
          <div ref={canvasRef} className="mind-map-canvas" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {allNodes.map(node => (
                layout.positions[node.id] &&
                <div key={node.id} data-id={node.id} className="mind-map-node-wrapper">
                  <MindMapNode {...node} position={layout.positions[node.id]} onDragStart={handleNodeDragStart} onLinkStart={handleLinkStart}/>
                </div>
            ))}
            <svg className="mind-map-connectors">
                {layout.links.map((link, i) => {
                    const fromPos = layout.positions[link.from];
                    const toPos = layout.positions[link.to];
                    if (!fromPos || !toPos) return null;
                    const canvasRect = canvasRef.current?.getBoundingClientRect();
                    if (!canvasRect) return null;

                    const p1 = { x: fromPos.x + 220, y: fromPos.y + 50 }; // Mid-right of node
                    const p2 = { x: toPos.x, y: toPos.y + 50 }; // Mid-left of node
                    
                    return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="connector-line" />;
                })}
                {linkState && canvasRef.current && (() => {
                    const canvasRect = canvasRef.current.getBoundingClientRect();
                    const startX = linkState.fromHandle.left + linkState.fromHandle.width / 2 - canvasRect.left + canvasRef.current.scrollLeft;
                    const startY = linkState.fromHandle.top + linkState.fromHandle.height / 2 - canvasRect.top + canvasRef.current.scrollTop;
                    const endX = linkState.to.x - canvasRect.left + canvasRef.current.scrollLeft;
                    const endY = linkState.to.y - canvasRect.top + canvasRef.current.scrollTop;
                    return <line x1={startX} y1={startY} x2={endX} y2={endY} className="connector-line-linking" />
                })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNotesModal;