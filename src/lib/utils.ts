import { writable } from "svelte/store";
import type { Gem } from "./types";
import YAML from "yaml";
import gemsUrl from "../../store/data.yaml?url";

export const gems = writable<Gem[]>([]);

export async function getGems(): Promise<void> {
    const cachedGems = localStorage.getItem("gems");

    if (cachedGems) {
        const parsedGems: Gem[] = JSON.parse(cachedGems);
        gems.set(parsedGems);
        return;
    }

    const res = await fetch(gemsUrl);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }

    const yamlString = await res.text();
    const data: Gem[] = YAML.parse(yamlString).reverse();
    localStorage.setItem("gems", JSON.stringify(data));
    gems.set(data);
}

export function saveGem(gem: Gem): void {
    gems.update(prev => [gem, ...prev,]);
    gems.subscribe(values => {
        localStorage.setItem("gems", JSON.stringify(values));
    });
}
