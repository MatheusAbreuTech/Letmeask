import { getDatabase, ref, remove, update } from 'firebase/database';

import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import Button from '../components/Button';
import Question from '../components/Question';
import RoomCode from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import useRoom from '../hooks/useRoom';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export default function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const navigate = useNavigate();

  function handleEndRoom() {
    const db = getDatabase();
    update(ref(db, `rooms/${roomId}`), {
      endeAt: new Date()
    });

    navigate('/');
  }

  function handleDeleteQuestion(questionId: string) {
    const modal = window.confirm(
      'Tem certeza que você deseja excluir essa pergunta?'
    );
    if (modal) {
      const db = getDatabase();
      remove(ref(db, `rooms/${roomId}/questions/${questionId}`));
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
