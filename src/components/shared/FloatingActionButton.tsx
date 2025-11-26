import { Plus } from "lucide-preact";


/* Floating Action Button - Mobile only */ 
export function FloatingActionButton({ onClick }: { onClick: () => void }) {
return <button
    onClick={onClick}
    class="lg:hidden fixed bottom-24 right-4 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg flex items-center justify-center z-40 transition-all active:scale-90 hover:scale-105"
>
    <Plus size={28} class="text-white" strokeWidth={2.5} />
</button>
}