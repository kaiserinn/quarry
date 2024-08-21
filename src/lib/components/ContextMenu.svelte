<script lang="ts">
    import { tick } from "svelte";
    import { gems } from "../utils";
    import { Check, Pencil, Trash2, X } from "lucide-svelte";
    import type { Gem } from "../types";
    import GemModal from "./GemModal.svelte";

    let gem = {
        title: "",
        id: "",
        date: "",
        cooked: false,
        pinned: false,
        tags: [],
        links: [],
        content: "",
    } as Gem;

    let showContextMenu = false;
    let contextMenuEl: HTMLDivElement;
    let showModal = false;

    export async function openContextMenu(e: MouseEvent, gemProp: Gem): Promise<void> {
        gem = gemProp;
        showContextMenu = true;
        await tick();

        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const contextMenuWidth = contextMenuEl.offsetWidth;
        const contextMenuHeight = contextMenuEl.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        contextMenuEl.style.top =
            mouseY + contextMenuHeight > windowHeight
                ? mouseY - contextMenuHeight + "px"
                : mouseY + "px";

        contextMenuEl.style.left =
            mouseX + contextMenuWidth > windowWidth
                ? mouseX - contextMenuWidth + "px"
                : mouseX + "px";
    }

    function toggleCooked(): void {
        gem.cooked = !gem.cooked;
        $gems = $gems;

        localStorage.setItem("gems", JSON.stringify($gems));
    }

    function deleteGem(): void {
        gems.set($gems.filter((v) => v.id !== gem.id));

        localStorage.setItem("gems", JSON.stringify($gems));
    }
</script>

<svelte:window on:click={() => showContextMenu = false} />

<GemModal bind:showModal state="EDIT" gem={gem} />

{#if showContextMenu}
    <div
        bind:this={contextMenuEl}
        class="absolute"    
    >
        <div class="p-3 flex flex-col rounded-md bg-ctp-mantle text-ctp-text shadow-md text-sm">
            <button
                on:click={toggleCooked}
                class="flex items-center gap-4 px-2 rounded py-2 hover:bg-ctp-mauve hover:text-ctp-base"
            >
                <svelte:component this={gem.cooked ? X : Check} class="w-[1em] h-[1em]"/>
                Mark As {gem.cooked ? "Raw" : "Cooked"}
            </button>
            <button
                on:click={deleteGem}
                class="flex items-center gap-4 px-2 rounded py-2 hover:bg-ctp-mauve hover:text-ctp-base"
            >
                <Trash2 class="w-[1em] h-[1em]" />
                Delete Gem
            </button>
            <button
                on:click={() => showModal = true}
                class="flex items-center gap-4 px-2 rounded py-2 hover:bg-ctp-mauve hover:text-ctp-base"
            >
                <Pencil class="w-[1em] h-[1em]" />
                Edit Gem
            </button>
        </div>
    </div>
{/if}
