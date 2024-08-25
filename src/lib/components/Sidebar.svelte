<script lang="ts">
    import { Download, Gem as GemIcon, Moon, Plus, Sun } from "lucide-svelte";
    import YAML from "yaml";
    import { gems } from "../utils";
    import GemModal from "./GemModal.svelte";
    import { onMount } from "svelte";

    let showModal = false;
    let theme: string;

    onMount(() => {
        const data = document.documentElement.dataset;
        if ("theme" in localStorage) {
            data.theme = localStorage.getItem("theme")!;
        } else {
            data.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        theme = data.theme;
    });

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

    function toggleTheme(): void {
        const data = document.documentElement.dataset;
        if (data.theme === "light") {
            data.theme = "dark";
        } else {
            data.theme = "light";
        }
        theme = data.theme;
        localStorage.setItem("theme", data.theme);
    }
</script>

<aside class="sticky top-0 flex h-screen flex-col justify-between p-8 opacity-30 hover:opacity-100">
    <section>
        <button>
            <GemIcon />
        </button>
    </section>
    <section class="flex flex-col gap-8">
        <button on:click={() => (showModal = true)}>
            <Plus />
        </button>
        <button on:click={toggleTheme}>
            <svelte:component this={theme === "light" ? Moon : Sun} />
        </button>
        <button on:click={download}>
            <Download />
        </button>
    </section>

    <GemModal bind:showModal state="ADD" />
</aside>
