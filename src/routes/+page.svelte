<script>
    // @ts-nocheck
    import Map from "./Map.svelte";
    import { addDocument, getScrape, getDocuments } from "$lib/model";
	import { ButtonGroup, Button, Modal, Alert, Dropdown, DropdownItem, DropdownDivider, DropdownHeader, Progressbar, Spinner, Popover } from "flowbite-svelte";
    import { writable } from "svelte/store";
    import ScrapeForm from "./ScrapeForm.svelte";
    import { ChevronDownOutline } from "flowbite-svelte-icons";
	import { onMount } from "svelte";
	import { collection } from "firebase/firestore";
    import AddLocForm from "./AddLocForm.svelte";
    import { loadAllImages } from "$lib/cache";
    import { sineOut } from "svelte/easing";
    import Footer from "./Footer.svelte";

    let ready = writable(false);
    let showWhole = writable(false);
    let showScrape = writable(false);
    let showAddLoc = writable(false);

    let currCategory = "";

    let name = "";
    let coords = ""

    let scrape;
    let category = "realestate";
    let location = "boston";
    let searchAmount = 1;

    let data;

    let categories = [];

    let progress = "50";

    const submit = async () => {
        const xcord = coords.substring(0, coords.indexOf(","));
        const ycord = coords.substring(coords.indexOf(",") + 1);
        const wholeCords = [parseFloat(ycord), parseFloat(xcord)]
        console.log(wholeCords);
        // const newycord = parseFloat(ycord)
        const data = {
            collection: "tech-companies",
            name: name,
            coords: wholeCords
        }
        try {
            const res = await addDocument(data);
            console.log(res);
            name = "";
            coords = "";
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetScrape = async () => {
        try {
            const toSend = {
                category: category,
                location: location,
                searchamount: searchAmount
            }
            scrape = await getScrape(toSend);
            console.log(scrape);
            if (scrape.status == 0) {
                data = scrape.data;
                console.log(data);
            }
        } catch (error) {
            console.log("error scraping: " + error);
        }
    }

    onMount(async () => {

        await loadAllImages();

        ready.set(false);
        if (categories.length > 1) { currCategory = categories[0]; }
        const URL = import.meta.env.VITE_URL;
        try {
            const res = await fetch(URL + 'get-colls');
        if (!res.ok) throw new Error('Failed to fetch');
            categories = await res.json();
            currCategory = categories[0];
        } catch (err) {
            console.log(err);
        }
        ready.set(true);
    })

</script>

<style>
    .buttongroup {
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5rem;
    }

    .footer-wrapper {
        position: fixed;
        bottom: 0;
    }

    .intro-text-wrapper {
        margin: 5rem;
        padding: 3rem;
        background-color: rgb(239, 236, 233);
        border-radius: 15px;
    }

</style>

{#if $showWhole}

    <Modal class="min-w-full" open={$showScrape} on:close={() => {showScrape.set(false); }} size="xl">
        
        {#each categories as c}
            {#if c == currCategory}
                <ScrapeForm></ScrapeForm>
            {/if}
        {/each}

    </Modal>

    <Modal class="min-w-full" open={$showAddLoc} on:close={() => {showAddLoc.set(false); }} size="xl">
        <AddLocForm addEdit={"Add"}></AddLocForm>
    </Modal>

    <div class="buttongroup">
        <ButtonGroup class="space-x-px">
            <Button pill color="blue" on:click={() => {showAddLoc.set(true); }}>
                Add Location
            </Button>
        </ButtonGroup>
    </div>

    <div class="mapcontainer">
        {#each categories as c}
            {#if c == currCategory}
                <Map useCategory={c}></Map>
            {/if}
        {/each}
    </div>

{:else}

    <div class="intro-text-wrapper">
        <p class="text-md dark:text-white">
            This site records local artist David Fichter's many murals and mosaics. Over the last 40 years he has colored the streets of Cambridge and Somerville with vibrant, community-centered murals stemming from large 50 feet pieces to smaller mosaics. He works with local students, artists, and residents to create unique pieces that record the history, traditions, values, and beauty of our city.
            <br><br>
            To view information on each mural, click on the circle icon to read brief descriptions and view photos in large detail.
            <br><br>
            This is an ongoing project, with murals continuously being added by David. Not every mural is represented, and more can be found on David's personal website <u><a href="http://www.davidfichter.com" target="_blank">www.davidfichter.com</a></u>. This map highlights his murals done in Cambridge and Somerville, althought David's work is seen throughout the country.
        </p>

        <br>

        {#if $ready}

            <center>
                <Button style="cursor:pointer;" outline color="dark" on:click={() => {showWhole.set(true);}}>View Map</Button>
            </center>
            
        {:else}

            <div class="progressbarcontainer" style="display:flex; justify-content:center; align-items:center; width:100%; height:100%">
                Loading all murals and mosaics ... 
                <Spinner size={5} color="green"></Spinner>
            </div>

        {/if}
    </div>
{/if}

<div class="footer-wrapper">
    <Footer></Footer>
</div>