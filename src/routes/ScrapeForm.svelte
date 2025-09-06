<script lang="js">
    // @ts-nocheck

	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Select, Textarea, Spinner, Toggle, ButtonGroup } from 'flowbite-svelte';
    import { addDocument, getScrape, getDocuments } from "$lib/model";
    import { writable } from 'svelte/store';
	import { load } from 'ol/Image';
	import { disable } from 'ol/rotationconstraint';
	import { onMount } from 'svelte';

    let loading = writable(false);
    let uploadMapLoading = writable(false);

    let category;
    let location;
    let searchAmount;
    let scrape;
    let headless = false;

    let data;
    let info;
	
    const handleGetScrape = async () => {
        loading.set(true);
        try {
            const toSend = {
                category: category,
                location: location,
                searchamount: searchAmount,
                headless: headless
            }
            scrape = await getScrape(toSend);
            console.log(scrape);
            if (scrape.status == 0) {
                data = scrape.data;
                console.log(data);
                info = data;
                console.log(info);
            }
        } catch (error) {
            console.log("error scraping: " + error);
        } finally {
            loading.set(false);
        }
    }

    const handleUploadToMap = async () => {
        uploadMapLoading.set(true);
        try {
            for (let i = 0; i < info.length; i++) {
                info[i]["collection"] = category;
                const res = await addDocument(info[i]);
                console.log(res);
                console.log("done");
            }
            uploadMapLoading.set(false);
        } catch (error) {
            console.log("error! " + error);
        }
    }

    function downloadData(dict, filename = 'data.csv') {
        if (!dict || typeof dict !== 'object') {
            console.error('Invalid input: not an object');
            return;
        }

        const items = Array.isArray(dict) ? dict : [dict]; // allow both single object or list of dicts
        const keys = Object.keys(items[0]);

        const csvRows = [
            keys.join(','), // header row
            ...items.map(item =>
            keys.map(k => {
                const val = item[k];
                return typeof val === 'string' && val.includes(',')
                ? `"${val.replace(/"/g, '""')}"`
                : val;
            }).join(',')
            )
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    onMount(async () => {
        info = await getDocuments(useCategory);
        console.log(info);
    })

    export let useCategory = "tech-companies";
</script>

<Section name="crudcreateform">
	<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Scrape New Data</h2>
	<form onsubmit={handleGetScrape}>
		<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
			<div class="sm:col-span-2">
				<Label for="category" class="mb-2">Category</Label>
				<Input type="text" id="category" placeholder="Real Estate" required bind:value={category}/>
			</div>
			<div class="w-full">
				<Label for="location" class="mb-2">Location</Label>
				<Input type="text" id="location" placeholder="Location" required bind:value={location}/>
			</div>
			<div class="w-full">
				<Label for="searchamount" class="mb-2">Search Amount</Label>
				<Input type="number" id="searchamount" placeholder="10" required bind:value={searchAmount}/>
			</div>
            <!-- <Toggle checked={headless} on:change={() => {headless = !headless}}>Watch it happen</Toggle> -->
            <div class="sm:col-span-2">
                {#if $loading}
                    <Button type="submit" class="w-32" disabled>
                        <Spinner color="primary" size={6}/>
                    </Button>
                {:else}
                    <Button type="submit" class="w-32">
                        Scrape Data
                    </Button>
                {/if}
            </div>
            <Button size="xs" color="green" outline type="button" class="w-32" on:click={() => {downloadData(info)}}>
                Download Data
            </Button>
		</div>
	</form>
</Section>

{#if info}

    <div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-lg text-gray-700 bg-gray-50">
                    <tr>
                        {#each Object.entries(info[0]) as [key, value]}
                            {#if key != 'id'}
                                <th scope="col" class="px-4 py-3">{key}</th>
                            {/if}
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each info as i}
                    <tr class="border-b tablerow">
                        {#each Object.entries(i) as [key, value]}
                            {#if key != 'id'}
                                <td class="px-4 py-3">
                                    {value}
                                </td>
                            {/if}
                        {/each}
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <ButtonGroup>
        {#if $uploadMapLoading}
            <Button outline color="green" disabled>
                <Spinner color="primary" size={6}/>
            </Button>
        {:else}
            <Button outline color="green" on:click={() => { handleUploadToMap(); }}>
                Upload to map
            </Button>
        {/if}
        <Button size="sm" color="green" outline type="button" class="w-32" on:click={() => {downloadData(info)}}>
            Download Data
        </Button>
    </ButtonGroup>

{/if}