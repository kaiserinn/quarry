<script lang="ts">
    import { Link, Plus, Tag } from "lucide-svelte";

    export let attributes: string[];
    export let attributeType: "TAG" | "LINK";

    let dialog: HTMLDialogElement;
    let newAttribute = "";

    function showAddPopover(e: MouseEvent): void {
        if (!e.clientX && !e.clientY) {
            dialog.style.top = "50%";
            dialog.style.left = "50%";
            dialog.style.transform = "translate(-50%, -50%)";
        } else {
            dialog.style.top = e.clientY + "px";
            dialog.style.left = e.clientX + "px";
        }
        dialog.showPopover();
    }

    function addHandler(): void {
        if (attributeType === "TAG") {
            addTag();
        } else {
            addLink();
        }
    }

    function addTag(): void {
        if (newAttribute) {
            attributes = attributes.concat(newAttribute);
            newAttribute = "";
            dialog.hidePopover();
        }
   }

    function addLink(): void {
        if (newAttribute) {
            const link = !newAttribute.startsWith("https://")
                ? `https://${newAttribute}`
                : newAttribute;
            attributes = attributes.concat(link);
            newAttribute = "";
            dialog.hidePopover();
        }
    }
</script>

<section class="flex gap-4 bg-ctp-surface1 px-6">
    <svelte:component class="flex-shrink-0" this={attributeType === "TAG" ? Tag : Link} />
    <div class="flex flex-wrap gap-2 items-center">
        {#each attributes as attribute}
            {#if attributeType === "TAG"}
                <p class="rounded-full bg-ctp-red px-2 text-sm font-bold text-ctp-crust">{attribute}</p>
            {:else if attributeType === "LINK"}
                <a href={attribute} class="underline decoration-[0.1em] underline-offset-2 hover:text-white">{attribute.split("/")[2]}</a>
            {/if}
        {/each}
        <button on:click|preventDefault={showAddPopover} class="hover:text-white self-stretch">
            <Plus size="16" />
        </button>
        <dialog
            bind:this={dialog}
            on:toggle={() => newAttribute = ""}
            popover="auto"
            id="add-tag"
            class="inset-[unset] rounded-md"
        >
            <div class="flex bg-ctp-surface0">
                <input
                    type="text"
                    bind:value={newAttribute}
                    on:keydown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addHandler();
                        }
                    } }
                    placeholder="Add a new link..."
                    class="bg-ctp-surface0 px-4 py-2 text-ctp-text focus:outline-none"
                />
                <button
                    on:click|preventDefault={() => addHandler()}
                    class="mr-2 text-ctp-text hover:text-white"
                >
                    <Plus size="16" />
                </button>
            </div>
        </dialog>
    </div>
</section>
