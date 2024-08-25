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
    class="group m-2 flex flex-col gap-4 rounded-xl border border-border-200/25 bg-background-200 p-5 text-text-100"
>
    <hgroup class="flex justify-between gap-4 text-2xl">
        <h1 class="text-text-100">{gem.title}</h1>
        <div class="flex">
            <button
                on:click={toggleCooked}
                class="group/button flex p-2 group-hover:text-text-100/50"
            >
                <svelte:component
                    this={gem.cooked ? X : Check}
                    class="mt-[-.5rem] h-[1.3em] w-[1.3em] opacity-0 group-hover/button:text-text-100 group-hover:opacity-100"
                />
            </button>
        </div>
    </hgroup>

    <section class="flex flex-col gap-2 text-sm">
        {#if gem.date}
            <div class="flex gap-2 font-mono">
                <Calendar size="16" />
                <p>{gem.date}</p>
            </div>
        {/if}

        {#if gem.tags && gem.tags.length > 0}
            <div class="flex gap-2">
                <Tag size="16" />
                <div class="flex flex-wrap gap-2">
                    {#each gem.tags as tag}
                        <p
                            class="rounded-full bg-accent-main-200 px-2 font-mono font-bold text-white"
                        >
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
                        <a href={link} class="font-mono hover:underline">{link.split("/")[2]}</a>
                    {/each}
                </div>
            </div>
        {/if}
    </section>

    {#if gem.content}
        <p class="whitespace-break-spaces">{gem.content}</p>
    {/if}
</article>
