import { useState } from 'react';
import { createNote, deleteNote } from '../../api/leads.api';
import { timeAgo } from '../../utils/formatters';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/uiSlice';

export default function NotesList({ leadId, notes, onRefresh }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await createNote(leadId, content.trim());
      setContent('');
      onRefresh();
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to add note' }));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(noteId) {
    if (!confirm('Delete this note?')) return;
    try {
      await deleteNote(leadId, noteId);
      onRefresh();
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to delete note' }));
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Add a note..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end mt-2">
          <button type="submit" disabled={saving || !content.trim()}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-xs rounded-lg">
            {saving ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{note.author} · {timeAgo(note.created_at)}</span>
              <button onClick={() => handleDelete(note.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-gray-400">No notes yet.</p>}
      </div>
    </div>
  );
}
