import PortraitGenerator from '../components/PortraitGenerator';

export default function Page() {
  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Retrato ? Golden Hour</h1>
        <p className="subtitle">
          Mujer joven de est?tica moderna y elegante, hiperrealista, enfoque suave, luz c?lida al atardecer.
        </p>
      </header>
      <PortraitGenerator />
      <footer className="footer">
        <span>? {new Date().getFullYear()} ? Generador visual contempor?neo</span>
      </footer>
    </main>
  );
}
