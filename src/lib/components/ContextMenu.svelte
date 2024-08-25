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

<svelte:window on:click={() => (showContextMenu = false)} />

<GemModal bind:showModal state="EDIT" {gem} />

{#if showContextMenu}
    <div bind:this={contextMenuEl} class="absolute">
        <div
            class="flex flex-col rounded-md border border-border-300/25 bg-background-300 p-1 text-text-100 shadow-md"
        >
            <button
                on:click={toggleCooked}
                class="hover:bg-accent-main-200 hover:text-white flex items-center gap-4 rounded px-4 py-2"
            >
                <svelte:component this={gem.cooked ? X : Check} class="h-[1em] w-[1em]" />
                Mark As {gem.cooked ? "Raw" : "Cooked"}
            </button>
            <button
                on:click={deleteGem}
                class="hover:bg-accent-main-200 hover:text-white flex items-center gap-4 rounded px-4 py-2"
            >
                <Trash2 class="h-[1em] w-[1em]" />
                Delete Gem
            </button>
            <button
                on:click={() => (showModal = true)}
                class="hover:bg-accent-main-200 hover:text-white flex items-center gap-4 rounded px-4 py-2"
            >
                <Pencil class="h-[1em] w-[1em]" />
                Edit Gem
            </button>
        </div>
    </div>
{/if}
