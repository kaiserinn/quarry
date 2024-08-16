<script lang="ts">
    import { LoaderCircle } from "lucide-svelte";
    import Card from "./lib/components/Card.svelte";
    import Sidebar from "./lib/components/Sidebar.svelte";
    import { getGems, gems } from "./lib/utils";
</script>

<svelte:body class="bg-ctp-base" />

<div class="flex min-h-screen overflow-visible bg-ctp-base text-ctp-text">
    <Sidebar />

    <main class="min-w-[26rem] flex-grow px-24 py-8">
        {#await getGems()}
            <section class="flex h-full items-center justify-center text-3xl gap-4">
                <LoaderCircle class="animate-spin w-[1em] h-[1em]" />
                Loading...
            </section>
        {:then}
            <section
                class="mx-auto grid max-w-[calc(var(--n)*23rem+((var(--n)-1)*1rem))] auto-rows-[10px] grid-cols-[repeat(auto-fit,_23rem)] justify-center [--n:_5]"
            >
                {#each $gems as gem (gem.id)}
                    <Card {gem} />
                {/each}
            </section>
        {:catch error}
            <section>{error}</section>
        {/await}
    </main>
</div>
