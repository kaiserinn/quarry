<script lang="ts">
    import { Calendar, Check, Link, Tag, X } from "lucide-svelte";
    import type { Gem } from "../types";
    import { afterUpdate } from "svelte";
    import { gems } from "../utils";
    import ContextMenu from "./ContextMenu.svelte";

    export let gem: Gem;
    export let contextMenu: ContextMenu;

    let card: HTMLElement;

    afterUpdate(async () => {
        card.style.gridRow = `span 1`;
        const height = card.scrollHeight;
        const span = Math.ceil((height + 32) / 10);
        card.style.gridRow = `span ${span}`;
    });

    async function toggleCooked() {
        gem.cooked = !gem.cooked;
        localStorage.setItem("gems", JSON.stringify($gems));
    }
</script>

<article
    bind:this={card}
    on:contextmenu|preventDefault={(e) => contextMenu.openContextMenu(e, gem)}
    class="group m-2 flex flex-col gap-4 rounded-xl bg-ctp-surface0 p-5 text-sm text-ctp-subtext0 hover:text-white"
>
    <hgroup class="flex justify-between gap-4 text-xl">
        <h1 class="text-white">{gem.title}</h1>
        <div class="flex">
            <button on:click={toggleCooked} class="flex p-2 group-hover:text-ctp-subtext1 group/button">
                <svelte:component
                    this={gem.cooked ? X : Check}
                    class="h-[1.3em] w-[1.3em] mt-[-.5rem] opacity-0 group-hover:opacity-100 group-hover/button:text-white"
                />
            </button>
        </div>
    </hgroup>

    <div class="flex flex-col gap-2">
        {#if gem.date}
            <div class="flex gap-2">
                <Calendar size="16" />
                <p>{gem.date}</p>
            </div>
        {/if}

        {#if gem.tags && gem.tags.length > 0}
            <div class="flex gap-2">
                <Tag size="16" />
                <div class="flex flex-wrap gap-2">
                    {#each gem.tags as tag}
                        <p class="rounded-full bg-ctp-red px-2 text-xs font-bold text-ctp-crust">
                            {tag}
                        </p>
                    {/each}
                </div>
            </div>
        {/if}

        {#if gem.links && gem.links.length > 0}
            <div class="flex gap-2">
                <Link size="16" />
                <div class="flex flex-wrap gap-2">
                    {#each gem.links as link}
                        <a href={link} class="hover:underline">{link.split("/")[2]}</a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    {#if gem.content}
        <p class="whitespace-break-spaces">{gem.content}</p>
    {/if}
</article>
