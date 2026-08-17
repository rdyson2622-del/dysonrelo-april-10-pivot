import SolutionMapEntry from './SolutionMapEntry';

// Home now renders the Solution Map entry page — the same front-door experience
// visitors see at "/". This keeps /home and / in sync.
export default function Home() {
  return <SolutionMapEntry />;
}