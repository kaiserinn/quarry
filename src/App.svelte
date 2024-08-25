<script lang="ts">
    import { LoaderCircle } from "lucide-svelte";
    import Card from "./lib/components/Card.svelte";
    import Sidebar from "./lib/components/Sidebar.svelte";
    import { getGems, gems } from "./lib/utils";
    import ContextMenu from "./lib/components/ContextMenu.svelte";

    let contextMenu: ContextMenu;
</script>

<div class="flex min-h-screen bg-background-300 font-serif text-text-300">
    <ContextMenu bind:this={contextMenu} />
    <Sidebar />

    <main class="min-w-[26rem] flex-grow px-24 py-8">
        {#await getGems()}
            <section class="flex h-full items-center justify-center gap-4 text-3xl">
                <LoaderCircle class="h-[1em] w-[1em] animate-spin" />
                Loading...
            </section>
        {:then}
            <section
                class="mx-auto grid max-w-[calc(var(--n)*25rem+((var(--n)-1)*1rem))] auto-rows-[10px] grid-cols-[repeat(auto-fit,_25rem)] justify-center [--n:_5]"
            >
                {#each $gems as gem (gem.id)}
                    <Card {gem} {contextMenu} />
                {/each}
            </section>
        {:catch error}
            <section>{error}</section>
        {/await}
    </main>
</div>
