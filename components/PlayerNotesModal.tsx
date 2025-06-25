
import React, { useState, useEffect, useRef } from 'react';
import { PlayerNote } from '../types';
import InteractiveText from './InteractiveText';

interface PlayerNotesModalProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  isOpen: boolean;
  onClose: () => void;
  notes: PlayerNote[];
  onAddNote: (noteData: { title: string; content: string; tags?: string[]; linkedLoreIds?: string[] }) => void;
  onUpdateNote: (note: PlayerNote) => void;
  onDeleteNote: (id: string) => void;
}

const soundService = {
  playSound: (soundKey: string) => {
    // console.log(`Playing sound: ${soundKey}`);
  }
};

const PlayerNotesModal: React.FC<PlayerNotesModalProps> = ({
  t,
  isOpen,
  onClose,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [noteLinkedLoreIds, setNoteLinkedLoreIds] = useState<string[]>([]);
  const [linkedLoreIdInput, setLinkedLoreIdInput] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      soundService.playSound('UI_MODAL_OPEN');
      modalRef.current?.focus();
      if (!isEditing) {
        resetForm();
      }
      setContentError(null); 
    } else {
      soundService.playSound('UI_MODAL_CLOSE');
      setIsEditing(false); 
      setShowDeleteConfirm(null);
      setContentError(null);
    }
  }, [isOpen, isEditing]);

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteTags([]);
    setTagInput('');
    setNoteLinkedLoreIds([]);
    setLinkedLoreIdInput('');
    setCurrentNoteId(null);
    setIsEditing(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
        setContentError(t("Note content cannot be empty."));
        contentInputRef.current?.focus();
        return;
    }
    setContentError(null);
    const finalTitle = noteTitle.trim() || `${t("New Entry")} - ${new Date().toLocaleDateString()}`;

    const noteData = { 
        title: finalTitle, 
        content: noteContent, 
        tags: noteTags, 
        linkedLoreIds: noteLinkedLoreIds 
    };

    if (isEditing && currentNoteId) {
      onUpdateNote({ ...noteData, id: currentNoteId, timestamp: new Date().toISOString() });
      soundService.playSound('NOTE_UPDATED');
    } else {
      onAddNote(noteData);
      soundService.playSound('NOTE_ADDED');
    }
    resetForm();
    titleInputRef.current?.focus();
  };

  const handleEditNote = (note: PlayerNote) => {
    setIsEditing(true);
    setCurrentNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags || []);
    setNoteLinkedLoreIds(note.linkedLoreIds || []);
    setTagInput('');
    setLinkedLoreIdInput('');
    setContentError(null);
    titleInputRef.current?.focus();
    soundService.playSound('UI_CLICK_SUBTLE');
  };
  
  const handleAddNewClick = () => {
    resetForm();
    titleInputRef.current?.focus();
    soundService.playSound('UI_CLICK_SUBTLE');
  };

  const handleDeleteClick = (noteId: string) => {
    setShowDeleteConfirm(noteId);
    soundService.playSound('UI_CLICK_SUBTLE');
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteNote(showDeleteConfirm);
      setShowDeleteConfirm(null);
      soundService.playSound('NOTE_DELETED');
      if (currentNoteId === showDeleteConfirm) { 
        handleAddNewClick(); 
      }
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    const newTags = tagInput.split(',')
      .map(tag => tag.trim().toLowerCase().replace(/[^a-z0-9#_-\s]/gi, '').replace(/\s+/g, '_')) // Sanitize and format
      .filter(tag => tag && !noteTags.includes(tag) && tag.length > 1 && tag.length <= 25);
    if (newTags.length > 0) {
      setNoteTags(prev => [...prev, ...newTags].slice(0, 10)); // Max 10 tags
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNoteTags(prev => prev.filter(tag => tag !== tagToRemove));
  };
  
  const handleLinkedLoreIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedLoreIdInput(e.target.value);
  };

  const handleAddLinkedLoreId = () => {
    const newIds = linkedLoreIdInput.split(',')
      .map(id => id.trim().toLowerCase().replace(/[^a-z0-9_]/gi, '')) // Sanitize
      .filter(id => id && !noteLinkedLoreIds.includes(id) && id.length > 3 && id.length <= 50);
    if (newIds.length > 0) {
      setNoteLinkedLoreIds(prev => [...prev, ...newIds].slice(0, 5)); // Max 5 linked IDs
      setLinkedLoreIdInput('');
    }
  };
  
  const handleRemoveLinkedLoreId = (idToRemove: string) => {
    setNoteLinkedLoreIds(prev => prev.filter(id => id !== idToRemove));
  };


  if (!isOpen) {
    return null;
  }

  const sortedNotes = [...notes].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-notes-title"
      tabIndex={-1}
    >
      <div
        className="modal-content-area bg-secondary p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col modal-content-enter-active"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="player-notes-title" className="font-heading text-3xl text-heading-color echoic-unveil-title">
            {t("My Personal Journal")}
          </h2>
          <button onClick={onClose} className="fantasy-button fantasy-button-secondary p-2 text-sm" aria-label={t("Close Journal")}>
            {t("Close Journal")}
          </button>
        </div>

        {/* Note Editor Form */}
        <form onSubmit={handleFormSubmit} className="mb-4 p-3 bg-primary rounded-md border border-divider-color">
          <h3 className="font-heading text-xl text-accent-primary mb-2">
            {isEditing ? t("Edit Entry") : t("New Entry")}
          </h3>
          {/* Title */}
          <div className="mb-2">
            <label htmlFor="noteTitle" className="font-body text-sm text-muted-color block">{t("Title (Optional):")}</label>
            <input
              ref={titleInputRef} type="text" id="noteTitle" value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder={t("E.g., 'Theron's Warning', 'Echoes in the Old Mill'")}
              className="w-full p-2 border border-divider-color rounded bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color"
            />
          </div>
          {/* Content */}
          <div className="mb-1">
            <label htmlFor="noteContent" className="font-body text-sm text-muted-color block">{t("Content:")}</label>
            <textarea
              id="noteContent" ref={contentInputRef} value={noteContent}
              onChange={(e) => { setNoteContent(e.target.value); if (contentError) setContentError(null); }}
              rows={3} required placeholder={t("Record your thoughts, theories, or reminders here...")}
              className={`w-full p-2 border rounded bg-secondary focus:outline-none focus:ring-1 text-main-color custom-scrollbar ${contentError ? 'border-magical-error-text ring-1 ring-magical-error-text' : 'border-divider-color focus:ring-accent-primary'}`}
              aria-invalid={!!contentError} aria-describedby={contentError ? "note-content-error" : undefined}
            />
          </div>
          {contentError && <p id="note-content-error" className="text-xs text-magical-error-text mb-2">{contentError}</p>}
          
          {/* Tags Input */}
          <div className="mb-2">
            <label htmlFor="noteTags" className="font-body text-sm text-muted-color block">{t("Tags (comma-separated):")}</label>
            <div className="flex">
              <input
                type="text" id="noteTags" value={tagInput} onChange={handleTagInputChange}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag();}}}
                placeholder={t("E.g., #Theron, #ArchitectMystery, #Heartstone")}
                className="w-full p-2 border border-divider-color rounded-l bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color"
              />
              <button type="button" onClick={handleAddTag} className="fantasy-button fantasy-button-subtle p-2 rounded-l-none text-xs">Add</button>
            </div>
            {noteTags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {noteTags.map(tag => (
                  <span key={tag} className="bg-accent-secondary text-xs text-button-text px-2 py-0.5 rounded-full flex items-center">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-button-text hover:text-magical-error-text">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Linked Lore IDs Input */}
          <div className="mb-2">
            <label htmlFor="noteLinkedLore" className="font-body text-sm text-muted-color block">{t("Linked Lore IDs (comma-separated):")}</label>
             <div className="flex">
                <input
                    type="text" id="noteLinkedLore" value={linkedLoreIdInput} onChange={handleLinkedLoreIdInputChange}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddLinkedLoreId();}}}
                    placeholder={t("E.g., lore_ancient_ritual, lore_theron_warning_1")}
                    className="w-full p-2 border border-divider-color rounded-l bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color"
                />
                <button type="button" onClick={handleAddLinkedLoreId} className="fantasy-button fantasy-button-subtle p-2 rounded-l-none text-xs">Add</button>
            </div>
            {noteLinkedLoreIds.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {noteLinkedLoreIds.map(id => (
                  <span key={id} className="bg-accent-secondary text-xs text-button-text px-2 py-0.5 rounded-full flex items-center">
                    {id}
                    <button type="button" onClick={() => handleRemoveLinkedLoreId(id)} className="ml-1.5 text-button-text hover:text-magical-error-text">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button type="submit" className="fantasy-button fantasy-button-primary flex-grow">
              {isEditing ? t("Save Changes") : t("Add Note")}
            </button>
            {isEditing && (
              <button type="button" onClick={handleAddNewClick} className="fantasy-button fantasy-button-secondary">
                {t("Cancel Edit")}
              </button>
            )}
          </div>
        </form>

        {/* Notes List */}
        <div className="overflow-y-auto custom-scrollbar flex-grow pr-1 space-y-3">
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div
                key={note.id}
                className={`log-entry-appear-staggered bg-primary p-3 rounded-lg border border-divider-color shadow-sm 
                            ${currentNoteId === note.id && isEditing ? 'ring-2 ring-accent-primary' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-md text-main-color illuminated-first-letter">{note.title}</h4>
                  <span className="text-xs text-muted-color whitespace-nowrap">
                    {new Date(note.timestamp).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <InteractiveText text={note.content.substring(0,150) + (note.content.length > 150 ? "..." : "")} className="text-sm text-main-color mb-1 whitespace-pre-wrap" />
                
                {note.tags && note.tags.length > 0 && (
                  <div className="mt-1.5 text-xs">
                    <strong className="text-muted-color">{t("Tags:")} </strong>
                    {note.tags.map(tag => (
                      <span key={tag} className="inline-block bg-accent-secondary text-button-text px-1.5 py-0.5 rounded-full mr-1 mb-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {note.linkedLoreIds && note.linkedLoreIds.length > 0 && (
                  <div className="mt-1 text-xs">
                    <strong className="text-muted-color">{t("Linked Lore:")} </strong>
                    {note.linkedLoreIds.map(id => (
                      <span key={id} className="inline-block bg-accent-secondary text-button-text px-1.5 py-0.5 rounded-full mr-1 mb-0.5">
                        {id} {/* Potentially make these clickable in future to open LoreJournal */}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2 justify-end">
                  <button onClick={() => handleEditNote(note)} className="fantasy-button fantasy-button-secondary text-xs px-2 py-1">
                    {t("Edit")}
                  </button>
                  <button onClick={() => handleDeleteClick(note.id)} className="fantasy-button fantasy-button-secondary text-xs px-2 py-1 error-text-color hover:bg-red-700 hover:text-white">
                    {t("Delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="font-body text-muted-color italic text-center py-5">
              {t("Your journal is empty. Time to scribe your thoughts!")}
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-secondary p-6 rounded-lg shadow-xl text-main-color w-full max-w-sm border-2 border-magical-dissonance-border">
            <h3 className="font-heading text-xl text-magical-dissonance-color mb-4 text-center">{t("Confirm Deletion")}</h3>
            <p className="font-body text-center mb-5">{t("Are you sure you want to delete this journal entry? This action cannot be undone.")}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="fantasy-button fantasy-button-secondary flex-1">
                {t("Cancel")}
              </button>
              <button onClick={confirmDelete} className="fantasy-button fantasy-button-primary flex-1 error-text-color hover:bg-red-800">
                {t("Delete Entry")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerNotesModal;
