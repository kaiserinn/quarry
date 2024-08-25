<script lang="ts">
    import { Link, Plus, Tag, X } from "lucide-svelte";

    export let attributes: string[];
    export let attributeType: "TAG" | "LINK";

    let dialog: HTMLDialogElement;
    let newAttribute = "";
    let linkAlias = "";

    let showPopoverButtonEl: HTMLButtonElement;

    function updatePosition(): void {
        let { x, y } = showPopoverButtonEl.getBoundingClientRect();

        const popoverWidth = dialog.clientWidth;
        const popoverHeight = dialog.clientHeight;
        const buttonWidth = showPopoverButtonEl.clientWidth;
        const buttonHeight = showPopoverButtonEl.clientHeight;

        x = x + buttonWidth - popoverWidth / 2;
        y = y - popoverHeight;

        dialog.style.left = x < 0 ? 0 + "px" : x + "px";
        dialog.style.top = y < 0 ? y + popoverHeight + buttonHeight + "px" : y + "px";
    }

    function showAddPopover(): void {
        dialog.showPopover();
        updatePosition();
    }

    function addHandler(): void {
        if (newAttribute) {
            if (attributeType === "LINK") {
                newAttribute = !newAttribute.startsWith("https://")
                    ? `https://${newAttribute}`
                    : newAttribute;
                newAttribute = `${newAttribute} ${linkAlias}`;
            }
            attributes = attributes.concat(newAttribute.trim());
            dialog.hidePopover();
        }
    }

    function handleEnter(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            e.preventDefault();
            addHandler();
        }
    }

    function clearInput(): void {
        newAttribute = "";
        linkAlias = "";
    }
</script>

<svelte:window on:resize={updatePosition} />

<section class="flex gap-4 px-6">
    <svelte:component this={attributeType === "TAG" ? Tag : Link} class="flex-shrink-0" />
    <div
        class="flex flex-wrap {attributeType === 'TAG'
            ? 'gap-2'
            : 'gap-4'} items-center text-text-300"
    >
        {#each attributes as attribute}
            {#if attributeType === "TAG"}
                <div
                    class="flex cursor-default items-center gap-1 rounded-full bg-accent-main-200 px-2 font-mono text-sm text-white"
                >
                    {attribute}
                    <button
                        on:click|preventDefault={() =>
                            (attributes = attributes.filter((attr) => attr !== attribute))}
                    >
                        <X class="h-[1em] w-[1em]" />
                    </button>
                </div>
            {:else if attributeType === "LINK"}
                <div class="flex items-center gap-1">
                    <a
                        href={attribute.split(" ")[0]}
                        class="underline decoration-[0.1em] underline-offset-2 hover:text-text-100 font-mono"
                    >
                        {attribute.split(" ").at(-1)}
                    </a>
                    <button
                        on:click|preventDefault={() =>
                            (attributes = attributes.filter((attr) => attr !== attribute))}
                    >
                        <X class="h-[1em] w-[1em]" />
                    </button>
                </div>
            {/if}
        {/each}
        <button
            bind:this={showPopoverButtonEl}
            on:click|preventDefault={showAddPopover}
            class="self-stretch hover:text-text-100"
        >
            <Plus size="16" />
        </button>
        <dialog
            bind:this={dialog}
            on:toggle={clearInput}
            popover="auto"
            id="add-tag"
            class="inset-[unset] rounded-md bg-background-300"
        >
            <div class="flex text-text-300 rounded-md border border-border-300/25">
                <div class="flex flex-col">
                    <input
                        type="text"
                        bind:value={newAttribute}
                        on:keydown={handleEnter}
                        placeholder={attributeType === "TAG"
                            ? "Add a new tag..."
                            : "Add a new link..."}
                        class="bg-background-300 px-4 py-2 placeholder:text-text-500 focus:outline-none"
                    />
                    {#if attributeType === "LINK"}
                        <input
                            type="text"
                            bind:value={linkAlias}
                            on:keydown={handleEnter}
                            placeholder="Optional name..."
                            class="bg-background-300 px-4 py-2 placeholder:text-text-500 focus:outline-none"
                        />
                    {/if}
                </div>
                <button
                    on:click|preventDefault={addHandler}
                    class="mr-2 text-text-300 hover:text-text-100"
                >
                    <Plus size="16" />
                </button>
            </div>
        </dialog>
    </div>
</section>
