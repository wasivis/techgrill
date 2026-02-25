import { startInterview } from './actions/interview';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-black text-orange-500 mb-2 italic">TECHGRILL</h1>
        <p className="text-zinc-400 mb-8">Face the AI Senior Dev. No mercy.</p>
        
        <form action={startInterview} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target Role</label>
            <input name="role" required placeholder="e.g. Frontend Engineer" className="w-full bg-black border border-zinc-800 p-3 rounded-xl focus:border-orange-500 outline-none transition" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Level</label>
            <select name="level" className="w-full bg-black border border-zinc-800 p-3 rounded-xl focus:border-orange-500 outline-none transition">
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
          </div>

          <button type="submit" className="cursor-pointer w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02]">
            Start the interview
          </button>
        </form>
      </div>
    </main>
  );
}