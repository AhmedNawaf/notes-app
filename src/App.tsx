import './App.css';
import { useState, useEffect } from 'react';
import NotesContainer from './components/Notes/NotesContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/Note';
import NoteForm from './components/Notes/NoteForm';
import Preview from './components/Preview/Preview';
import Message from './components/Message/Message';
import Alert from './components/Alert/Alert';

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<number>();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes') || ''));
    } else {
      localStorage.setItem('notes', JSON.stringify([]));
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([]);
      }, 3000);
    }
  }, [validationErrors]);

  // حفظ في الذاكرة المحلية
  function saveToLocalStorage(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function validate() {
    const validationErrors: string[] = [];
    let passed = true;
    if (!title) {
      validationErrors.push('الرجاء إدخال عنوان الملاحظة');
      passed = false;
    }
    if (!content) {
      validationErrors.push('الرجاء إدخال محتوى الملاحظة');
      passed = false;
    }
    setValidationErrors(validationErrors);
    return passed;
  }

  //تغيير عنوان الملاحظة
  function changeTitleHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  //تغيير نص الملاحظة
  function changeContentHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  //الانتقال إلى وضع إضافة ملاحظة
  function addNoteHandler() {
    setCreating(true);
    setTitle('');
    setContent('');
    setEditing(false);
  }

  //اختيار ملاحظة
  function selectNoteHandler(noteId: number) {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  }

  //حفظ الملاحظة
  function saveNoteHandler() {
    if (!validate()) return;
    const note = {
      id: notes.length + 1,
      title: title,
      content: content,
    };
    const updatedNotes = [...notes, note];
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setTitle('');
    setContent('');
    setCreating(false);
    setSelectedNote(note.id);
  }

  //حذف الملاحظة
  function deleteNoteHandler(noteId: number | undefined) {
    const updatedNotes = [...notes];
    const noteIndex = updatedNotes.findIndex((note) => note.id === noteId);
    updatedNotes.splice(noteIndex, 1);
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setSelectedNote(undefined);
  }

  //الانتقال إلى وضع تعديل الملاحظة
  function editNoteHandler(noteId: number | undefined) {
    const note = notes.find((note) => note.id === noteId);
    if (!note) throw 'editNoteHandler has empty note';
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }

  // حفظ تعديلات الملاحظة
  function updateNoteHandler() {
    if (!validate()) return;

    const modifiedNotes = notes.map((note) =>
      note.id === selectedNote ? { ...note, title, content } : note
    );

    saveToLocalStorage('notes', modifiedNotes);
    setNotes(modifiedNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  //إحضار قسم عرض الملاحظة
  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title='لا يوجد ملاحظات' />;
    }

    if (!selectedNote) {
      return <Message title='الرجاء اختيار ملاحظة' />;
    }

    const note = notes.find((note) => {
      return note.id === selectedNote;
    });

    let noteDisplay = (
      <div>
        <h2>{note?.title}</h2>
        <p>{note?.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle='تعديل ملاحظة'
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText='تعديل'
          submitClicked={updateNoteHandler}
        />
      );
    }

    return (
      <div>
        {!editing && (
          <div className='note-operations'>
            <a
              href='#'
              onClick={() => editNoteHandler(note?.id)}
            >
              <i className='fa fa-pencil-alt' />
            </a>
            <a
              href='#'
              onClick={() => deleteNoteHandler(note?.id)}
            >
              <i className='fa fa-trash' />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className='App'>
      <NotesContainer>
        <NotesList>
          {notes.map((note) => (
            <Note
              key={note.id}
              title={note.title}
              active={selectedNote === note.id}
              noteClicked={() => selectNoteHandler(note.id)}
            />
          ))}
        </NotesList>
        <button
          className='add-btn'
          onClick={addNoteHandler}
        >
          +
        </button>
      </NotesContainer>
      <Preview>
        {creating ? (
          <NoteForm
            formTitle='ملاحظة جديدة'
            title={title}
            content={content}
            titleChanged={changeTitleHandler}
            contentChanged={changeContentHandler}
            submitText='حفظ'
            submitClicked={saveNoteHandler}
          />
        ) : (
          getPreview()
        )}
      </Preview>

      {validationErrors.length !== 0 && <Alert messages={validationErrors} />}
    </div>
  );
}

export default App;
