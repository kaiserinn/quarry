<script lang="ts">
    import { Link, Microscope, Pin, Plus, Tag, X } from "lucide-svelte";
    import type { Gem } from "../types";
    import { gems } from "../utils";

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

    let tagDialog: HTMLDialogElement;
    let newTagValue: string;

    let linkDialog: HTMLDialogElement;
    let newLinkValue: string;

    $: if (showModal) {
        dialog?.showModal();
    }

    function showAddTagPopover(e: MouseEvent): void {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        tagDialog.style.top = mouseY + "px";
        tagDialog.style.left = mouseX + "px";
        tagDialog.showPopover();
    }

    function addTag(): void {
        if (newTagValue) {
            gem.tags = gem.tags.concat(newTagValue);
            newTagValue = "";
            tagDialog.hidePopover();
        }
   }

    function showAddLinkPopover(e: MouseEvent): void {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        linkDialog.style.top = mouseY + "px";
        linkDialog.style.left = mouseX + "px";
        linkDialog.showPopover();
    }

    function addLink(): void {
        if (newLinkValue) {
            const newLink = !newLinkValue.startsWith("https://")
                ? `https://${newLinkValue}`
                : newLinkValue;
            gem.links = gem.links.concat(newLink);
            newLinkValue = "";
            linkDialog.hidePopover();
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
    <form on:submit|preventDefault={researchGem} class="flex flex-col gap-6 bg-ctp-surface1 pb-4 resize-y overflow-auto min-h-[26rem]">
        <section class="flex flex-col flex-grow">
            <input
                bind:value={gem.title}
                type="text"
                required
                placeholder="Title"
                autocomplete="off"
                class="bg-ctp-surface1 px-6 pb-4 pt-8 text-2xl text-white placeholder-ctp-text focus:outline-none"
            />
            <textarea
                bind:value={gem.content}
                rows="5"
                placeholder="Fruitful thought..."
                autocomplete="off"
                spellcheck="false"
                wrap="off"
                class="bg-ctp-surface1 px-6 pb-6 text-ctp-text placeholder-ctp-subtext0 focus:outline-none resize-none flex-grow"
            ></textarea>
        </section>
        <section class="flex gap-4 bg-ctp-surface1 px-6">
            <Tag class="max-w-[24px] flex-shrink-0" />
            <div class="flex flex-wrap gap-2">
                {#each gem.tags as tag}
                    <p class="rounded-full bg-ctp-red px-2 text-sm font-bold text-ctp-crust">
                        {tag}
                    </p>
                {/each}
                <button on:click|preventDefault={showAddTagPopover} class="hover:text-white">
                    <Plus size="16" />
                </button>
                <dialog
                    bind:this={tagDialog}
                    popover="auto"
                    id="add-tag"
                    class="rounded-md inset-[unset]"
                >
                    <div class="flex bg-ctp-surface0">
                        <input
                            type="text"
                            bind:value={newTagValue}
                            placeholder="Add a new tag..."
                            class="bg-ctp-surface0 px-4 py-2 text-ctp-text focus:outline-none"
                        />
                        <button
                            on:click|preventDefault={addTag}
                            class="pr-2 text-ctp-text hover:text-white"
                        >
                            <Plus size="16" />
                        </button>
                    </div>
                </dialog>
            </div>
        </section>

        <section class="flex gap-4 bg-ctp-surface1 px-6">
            <Link class="flex-shrink-0" />
            <div class="flex flex-wrap gap-4">
                {#each gem.links as link}
                    <a href={link} class="underline hover:text-white">{link.split("/")[2]}</a>
                {/each}
                <button on:click|preventDefault={showAddLinkPopover} class="hover:text-white">
                    <Plus size="16" />
                </button>
                <dialog
                    bind:this={linkDialog}
                    popover="auto"
                    id="add-tag"
                    class="inset-[unset] rounded-md"
                >
                    <div class="flex bg-ctp-surface0">
                        <input
                            type="text"
                            bind:value={newLinkValue}
                            placeholder="Add a new link..."
                            class="bg-ctp-surface0 px-4 py-2 text-ctp-text focus:outline-none"
                        />
                        <button
                            on:click|preventDefault={addLink}
                            class="pr-2 text-ctp-text hover:text-white"
                        >
                            <Plus size="16" />
                        </button>
                    </div>
                </dialog>
            </div>
        </section>

        <div class="border-t-[1px] my-[-0.5rem] border-t-ctp-text text-ctp-base"></div>

        <section class="flex justify-between px-4">
            <label
                class="flex cursor-pointer select-none gap-2 rounded-md px-2 py-2 hover:text-white has-[:checked]:bg-ctp-mauve has-[:checked]:text-ctp-surface0 has-[:checked]:hover:opacity-90"
            >
                <input bind:checked={gem.pinned} type="checkbox" hidden />
                <Pin />
                Pin
            </label>
            <button
                class="flex gap-2 rounded-md bg-ctp-mauve px-4 py-2 text-ctp-base hover:opacity-90"
            >
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
