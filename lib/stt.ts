/**
 * Server-side speech-to-text upgrade path for uploaded recordings.
 *
 * Driving2Develop ships with ZERO required paid APIs. Live practice gets a real
 * transcript for free via the browser's SpeechRecognition API. Uploaded
 * files, however, are arbitrary audio files with no bundled STT engine -
 * there is no free, in-browser way to transcribe an arbitrary mp3/wav/m4a.
 *
 * If the operator adds an OPENAI_API_KEY, this function opportunistically
 * calls the Whisper transcription API and the upload pipeline upgrades
 * automatically (see app/api/sessions/route.ts). Without a key, it returns
 * null and the upload pipeline honestly falls back to acoustic-only metrics
 * (RMS energy / pause detection) with a "Transcript unavailable" state in
 * the UI - never a silently-faked transcript.
 */
export async function transcribeAudio(buffer: Buffer, fileName: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const form = new FormData();
    const blob = new Blob([new Uint8Array(buffer)]);
    form.append("file", blob, fileName || "audio.wav");
    form.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
    });

    if (!response.ok) {
      console.error("Whisper transcription failed", await response.text());
      return null;
    }

    const data = (await response.json()) as { text?: string };
    return data.text ?? null;
  } catch (err) {
    console.error("Whisper transcription error", err);
    return null;
  }
}
