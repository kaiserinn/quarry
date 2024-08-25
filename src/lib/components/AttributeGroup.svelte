<script lang="ts">
    import { Link, Plus, Tag, X } from "lucide-svelte";
    import { onMount } from "svelte";

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

    onMount(showAddPopover);

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
                        class="font-mono underline decoration-[0.1em] underline-offset-2 hover:text-text-100"
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
            class="inset-[unset] rounded-md bg-background-200 shadow"
        >
            <div
                class="flex flex-col gap-3 rounded-md border border-border-300/25 p-3 font-mono text-text-300"
            >
                <h1 class="font-serif text-2xl text-text-100">
                    {attributeType === "TAG" ? "Add a New Tag" : "Add a New Link"}
                </h1>
                <fieldset class="grid grid-cols-[auto,_1fr] items-center gap-2">
                    <label for="new-attribute" class=""
                        >{attributeType === "TAG" ? "Tag" : "Link"}</label
                    >
                    <input
                        type="text"
                        bind:value={newAttribute}
                        on:keydown={handleEnter}
                        placeholder={attributeType === "TAG" ? "Tag name..." : "Link URL..."}
                        id="new-attribute"
                        class="rounded-md border border-border-300/50 bg-background-200 px-4 py-1 placeholder:text-text-500 focus:outline focus:outline-[1px] focus:outline-border-400"
                    />

                    {#if attributeType === "LINK"}
                        <label for="new-attribute" class="">Name</label>
                        <input
                            type="text"
                            bind:value={linkAlias}
                            on:keydown={handleEnter}
                            placeholder="Optional name..."
                            class="rounded-md border border-border-300/50 bg-background-200 px-4 py-1 placeholder:text-text-500 focus:outline focus:outline-[1px] focus:outline-border-400"
                        />
                    {/if}
                </fieldset>
                <section>
                    <button
                        on:click|preventDefault={addHandler}
                        class="gap-2font-serif ml-auto flex items-center rounded-md bg-accent-main-200 px-2 py-1 text-text-300 text-white hover:bg-accent-main-100"
                    >
                        <Plus size="16" /> Add
                    </button>
                </section>
            </div>
        </dialog>
    </div>
</section>
