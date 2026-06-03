import { InteractivePrototype } from "@/components/prototype/interactive-demo";
import { SystemNav } from "@/components/landing/system-nav";

export default function PrototypePage() {
  return (
    <div className="min-h-screen bg-void">
      <SystemNav />
      <main className="pt-20">
        <InteractivePrototype />
      </main>
    </div>
  );
}
