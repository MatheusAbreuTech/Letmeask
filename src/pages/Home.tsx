import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';

import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { child, get, getDatabase, ref } from 'firebase/database';

export default function Home() {
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    // se não estiver logado, efetue o login
    if (!user) {
      await signInWithGoogle();
    }

    //se já estiver logado, redirecione para a página newRoom
    navigate('/rooms/new');
  }

  function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const dbRef = ref(getDatabase());
    get(child(dbRef, `rooms/${roomCode}`)).then((snapshot) => {
      if (snapshot.exists()) {
        navigate(`/rooms/${roomCode}`);
      } else {
        alert('Room does not exists.');
        setRoomCode('');
        return;
      }

      if (snapshot.val().endeAt) {
        alert('Room already closed.');
        setRoomCode('');
        navigate('/');

        return;
      }
    });
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
