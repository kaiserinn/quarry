<script lang="ts">
    import { Download, Gem as GemIcon, Plus } from "lucide-svelte";
    import type { Gem } from "../types";
    import YAML from "yaml";
    import { gems } from "../utils";
    import GemModal from "./GemModal.svelte";

    let showModal = false;

    function download(): void {
        if (!$gems) return;

        const gemsBlob = new Blob([YAML.stringify($gems)], {
            type: "application/yaml",
        });
        const url = URL.createObjectURL(gemsBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.yaml";
        link.click();

        URL.revokeObjectURL(url);
    }
</script>

<aside class="sticky top-0 flex h-screen flex-col justify-between p-8 opacity-30 hover:opacity-100">
    <section>
        <button>
            <GemIcon />
        </button>
    </section>
    <section class="flex flex-col gap-8">
        <button on:click={() => showModal = true}>
            <Plus />
        </button>
        <button on:click={download}>
            <Download />
        </button>
    </section>

    <GemModal bind:showModal state="ADD" />
</aside>
