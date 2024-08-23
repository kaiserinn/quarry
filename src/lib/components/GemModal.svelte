<script lang="ts">
    import { Microscope, Pin, X } from "lucide-svelte";
    import type { Gem } from "../types";
    import { gems } from "../utils";
    import AttributeGroup from "./AttributeGroup.svelte";

    export let showModal: boolean;
    export let state: "ADD" | "EDIT";

    export let gem: Gem = {
        title: "",
        id: "",
        date: "",
        cooked: false,
        pinned: false,
        tags: [],
        links: [],
        content: "",
    };

    let dialog: HTMLDialogElement;
    let textareaEl: HTMLTextAreaElement;

    // Backup gem in case the modal is closed mid edit
    let backupGem: Gem;

    $: if (showModal) {
        dialog?.showModal();
        generateBackupGem();
    }

    function generateBackupGem() {
        if (state === "EDIT") {
            backupGem = structuredClone(gem);
        }
    }

    function researchGem(): void {
        if (state === "ADD") {
            gem.id = crypto.randomUUID();
            const date = new Date();
            gem.date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

            $gems = [gem].concat($gems);
        } else if (state === "EDIT") {
            $gems = $gems;
        }

        localStorage.setItem("gems", JSON.stringify($gems));

        dialog.close();
    }

    function handleClose(): void {

        // because gem is a reference to the gems store, gem needs to go back
        // to its initial value if the modal is closed mid edit
        if (state === "EDIT") {
            gem.title = backupGem.title;
            gem.pinned = backupGem.pinned;
            gem.tags = backupGem.tags;
            gem.links = backupGem.links;
            gem.content = backupGem.content;
        }

        gem = {
            title: "",
            id: "",
            date: "",
            cooked: false,
            pinned: false,
            tags: [],
            links: [],
            content: "",
        };

        showModal = false;
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    bind:this={dialog}
    on:close={handleClose}
    on:click|self={() => dialog.close()}
    class="w-[30rem] rounded-xl bg-ctp-surface0 text-ctp-text backdrop:backdrop-blur backdrop:backdrop-brightness-75"
>
    <button on:click={() => dialog.close()} class="absolute right-1 top-1 p-4 hover:text-white">
        <X size="16" />
    </button>
    <form
        on:submit|preventDefault={researchGem}
        class="flex flex-col gap-6 bg-ctp-surface1 pb-4 overflow-auto min-h-[26rem]"
    >
        <section class="flex flex-col flex-grow">
            <input
                bind:value={gem.title}
                on:keydown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        textareaEl.focus();
                    }
                }}
                type="text"
                required
                placeholder="Title"
                autocomplete="off"
                class="bg-ctp-surface1 px-6 pb-4 pt-8 text-2xl text-white placeholder-ctp-text focus:outline-none"
            />
            <textarea
                bind:this={textareaEl}
                bind:value={gem.content}
                rows="10"
                placeholder="Fruitful thought..."
                autocomplete="off"
                spellcheck="false"
                class="bg-ctp-surface1 px-6 pb-6 text-ctp-text placeholder-ctp-subtext0 focus:outline-none resize-none flex-grow"
            ></textarea>
        </section>

        <AttributeGroup bind:attributes={gem.tags} attributeType="TAG" />

        <AttributeGroup bind:attributes={gem.links} attributeType="LINK" />

        <div class="border-t-[1px] my-[-0.5rem] border-t-ctp-text text-ctp-base"></div>

        <section class="flex justify-between px-4">
            <label
                class="flex cursor-pointer select-none gap-2 rounded-md px-2 py-2 hover:text-white has-[:checked]:bg-ctp-mauve has-[:checked]:text-ctp-surface0 has-[:checked]:hover:opacity-90"
            >
                <input bind:checked={gem.pinned} type="checkbox" hidden />
                <Pin />
                Pin
            </label>
            <button class="flex gap-2 rounded-md bg-ctp-mauve px-4 py-2 text-ctp-base hover:opacity-90">
                <Microscope />
                Research
            </button>
        </section>
    </form>
</dialog>

<style>
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.9);
        }
        to {
            transform: scale(1);
        }
    }
</style>
