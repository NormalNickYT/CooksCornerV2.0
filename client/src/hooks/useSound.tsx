export default function useSound(soundFile : string) {
  function playSound() {
    const audio = new Audio(soundFile);
    audio.play();
  }
  return [playSound];
}
