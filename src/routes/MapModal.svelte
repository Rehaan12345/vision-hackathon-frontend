<script lang="js">
    //@ts-nocheck

    import { onMount } from 'svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { Button, Drawer, CloseButton, Heading, Alert, Modal } from 'flowbite-svelte';
	import Map from './Map.svelte';
    import { getImage } from '$lib/model';
    import { getCachedImgs } from '$lib/cache';
	import { writable } from 'svelte/store';
    import AddLocForm from './AddLocForm.svelte';

    const SEND_URL = import.meta.env.VITE_URL;

    let showImgModal = writable(false);
    let showAddLoc = writable(false);
    let showBigImg = writable(false);

    let images = [];

    let categories = [];

    let bigImgUrl = "";

    let columns;

    onMount(async () => {

        console.log(mapData);

        let imgs = getCachedImgs();
        console.log(imgs);

        if (imgs) images = imgs[mapData.id];
        else images = await getImage(mapData.id)

    });

    export let mapData = {"title": "Loading ...", "id": "rehaan"}
</script>

<style>
    .contentwrapper {
        display: flex;
        justify-content: space-around;
    }

    .textwrapper {
        min-width: 20rem;
        max-width: 35rem;
    }

    .valuewrapper {
        margin: 1rem;
        font-size: large;
    }

    .imgswrapper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .indimgwrapper {
        min-width: 40%;
        min-height: 10%;
        max-width: 50%;
        max-height: 50%;
        padding: 1rem;
    }


/* Small screens (phones, < 640px) */
@media (max-width: 640px) {
    .contentwrapper {
        flex-direction: column; /* stack text and images */
        align-items: center;
        justify-content: center;
    }

    .textwrapper {
        min-width: unset;
        max-width: 90%; /* take most of the width */
        padding: 0 1rem;
    }

    .valuewrapper {
        font-size: medium; /* slightly smaller for readability */
        margin: 0.5rem 0;
    }

    .imgswrapper {
        justify-content: center; /* center images */
        flex-direction: column; /* stack if needed */
        gap: 1rem;
    }

    .indimgwrapper {
        min-width: 80%; /* make images bigger for mobile */
        max-width: 90%;
        padding: 0.5rem;
    }

    .indimgwrapper img {
        width: 100%;
        height: auto;
    }
}


/* Medium screens (tablets, 641px–900px) */
@media (max-width: 900px) and (min-width: 641px) {
    .contentwrapper {
        flex-direction: column;
        align-items: center;
    }

    .textwrapper {
        min-width: unset;
        max-width: 80%;
    }

    .imgswrapper {
        justify-content: center;
    }

    .indimgwrapper {
        min-width: 45%;
        max-width: 45%;
    }
}
</style>

<Modal class="min-w-full" open={$showBigImg} on:close={() => {showBigImg.set(false); }} size="xl">
    <img on:click={() => {showBigImg.set(false);}} style="border-radius:5px" src={bigImgUrl} alt="david-fichter-mural">
</Modal>

<Modal class="min-w-full" open={$showAddLoc} on:close={() => {showAddLoc.set(false); }} size="xl">
    <AddLocForm addEdit={"Edit"} editVal={mapData}></AddLocForm>
</Modal>

<p class="text-3xl text-gray-900" style="margin-bottom: 1rem;">
    <Button pill color="blue" on:click={() => {showAddLoc.set(true);}}>Edit</Button>
    {mapData.title}
</p>

<div class="contentwrapper">

    <div class="textwrapper">
        {#each Object.entries(mapData) as [key, value]}
            {#if key != "id" && key != "category" && key != "title" && key != "coords" && key != "addCoor" && key != "newLoc" && key != "moreData" && key != "docId"}

                <Alert color="dark">
                    <span class="font-medium">{key}</span>
                    <div class="valuewrapper">{value}</div>
                </Alert>

            {/if}
        {/each}
    </div>

    {#if images}

        <div class="imgswrapper">
            {#each images as i}

                <div class="indimgwrapper">
                    <img on:click={() => {bigImgUrl = i; showBigImg.set(true);}} style="border-radius:5px; cursor:pointer;" src={i} alt="david-fichter-mural">
                </div>

            {/each}
        </div>

    {/if}

</div>
