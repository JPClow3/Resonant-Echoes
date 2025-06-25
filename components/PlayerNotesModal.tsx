
import React, { useState, useEffect, useRef } from 'react';
import { PlayerNote } from '../types';
import InteractiveText from './InteractiveText';

interface PlayerNotesModalProps {
  t: (key: string, params?: Record<string, string | number>) => string; // Translation function
  isOpen: boolean;
  onClose: () => void;
  notes: PlayerNote[];
  onAddNote: (noteData: { title: string; content: string }) => void;
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
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      soundService.playSound('UI_MODAL_OPEN');
      modalRef.current?.focus();
      if (!isEditing) {
        setNoteTitle('');
        setNoteContent('');
        setCurrentNoteId(null);
      }
    } else {
      soundService.playSound('UI_MODAL_CLOSE');
      setIsEditing(false); 
      setShowDeleteConfirm(null);
    }
  }, [isOpen]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
        alert("Note content cannot be empty."); 
        return;
    }
    const finalTitle = noteTitle.trim() || `${t("New Entry")} - ${new Date().toLocaleDateString()}`;

    if (isEditing && currentNoteId) {
      onUpdateNote({ id: currentNoteId, title: finalTitle, content: noteContent, timestamp: new Date().toISOString() });
      soundService.playSound('NOTE_UPDATED');
    } else {
      onAddNote({ title: finalTitle, content: noteContent });
      soundService.playSound('NOTE_ADDED');
    }
    setNoteTitle('');
    setNoteContent('');
    setCurrentNoteId(null);
    setIsEditing(false);
    titleInputRef.current?.focus();
  };

  const handleEditNote = (note: PlayerNote) => {
    setIsEditing(true);
    setCurrentNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    titleInputRef.current?.focus();
    soundService.playSound('UI_CLICK_SUBTLE');
  };
  
  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentNoteId(null);
    setNoteTitle('');
    setNoteContent('');
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

        <form onSubmit={handleFormSubmit} className="mb-4 p-3 bg-primary rounded-md border border-divider-color">
          <h3 className="font-heading text-xl text-accent-primary mb-2">
            {isEditing ? t("Edit Entry") : t("New Entry")}
          </h3>
          <div className="mb-2">
            <label htmlFor="noteTitle" className="font-body text-sm text-muted-color block">{t("Title (Optional):")}</label>
            <input
              ref={titleInputRef}
              type="text"
              id="noteTitle"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder={t("E.g., 'Theron's Warning', 'Echoes in the Old Mill'")}
              className="w-full p-2 border border-divider-color rounded bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="noteContent" className="font-body text-sm text-muted-color block">{t("Content:")}</label>
            <textarea
              id="noteContent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={4}
              required
              placeholder={t("Record your thoughts, theories, or reminders here...")}
              className="w-full p-2 border border-divider-color rounded bg-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary text-main-color custom-scrollbar"
            />
          </div>
          <div className="flex gap-2">
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
                <InteractiveText text={note.content.substring(0,150) + (note.content.length > 150 ? "..." : "")} className="text-sm text-main-color mb-2 whitespace-pre-wrap" />

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
