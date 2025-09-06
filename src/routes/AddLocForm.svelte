<script lang="js">
    // @ts-nocheck

	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Select, Textarea, Spinner, Toggle, ButtonGroup, Alert, Modal } from 'flowbite-svelte';
    import { addDocument, getScrape, getDocuments, getAddLocation, deleteDoc, checkPass } from "$lib/model";
    import { writable } from 'svelte/store';
	import { load } from 'ol/Image';
	import { disable } from 'ol/rotationconstraint';
	import { onMount } from 'svelte';
    import UploadPhotos from "./UploadPhotos.svelte";

    let ready = writable(false);
    let loading = writable(false);
    let saveLoading = writable(false);
    let successMessage = writable("");
    let showDeleteModal = writable(false);
    let showWhole = writable(false);
    let checkingPass = writable(false);

    let newCatList = [];
    let selectedCat = "murals";
    
    const addCoorList = [{value: "add", name: "Address"}, {value: "coor", name: "Coordinates"}];
    let addCoor = "add";

    let addLoc = "add";

    let title = "";

    let about = "";

    let dataCount = 0;

    let moreData = []; // each element of the list will be a dictionary with a {label: input} format.

    let addedLocId = "";

    let imgFolderId = "";

    let docId = "";

    let pass = "";

    const addLocation = async () => {
        loading.set(true);
        addCoor = "add"; // DELETE WHEN PUTTING SELECT FOR COORDS BACK!
        let newLoc = true;
        if (addEdit == "Edit") newLoc = false;
        try {
            const toSend = {
                newLoc: newLoc,
                category: selectedCat,
                addCoor: addCoor,
                Location: addLoc,
                moreData: moreData,
                title: title,
                About: about,
                docId: imgFolderId
            }
            console.log(toSend);
            imgFolderId = await getAddLocation(toSend);
            successMessage.set("Successfully " + addEdit + "ed location. Add pictures below.");
        } catch (error) {
            console.log("error scraping: " + error);
        } finally {
            loading.set(false);
        }
    }

    const handleDelete = async () => {
        try {
            await deleteDoc(editVal.id);
        } catch (error) {
            console.log("Failed to delete!");
        }
    }

    const handlePassCheck = async () => {
        checkingPass.set(true);
        const checkedPass = await checkPass(pass);
        if (checkedPass == 0) {
            showWhole.set(true);
            localStorage.setItem("password", pass);
        }
        else showWhole.set(false);
        checkingPass.set(false);
    }

    // Change the values of the variables following the colon depending on if the dictionary editVal is populated or not (really for adding / editing a location).

    $: addCoor = Object.keys(editVal).length === 0
		? '' // nothing selected
		: editVal["addCoor"] ?? '';

    $: addLoc = Object.keys(editVal).length === 0
		? '' // nothing selected
		: editVal["Location"] ?? '';

    $: title = Object.keys(editVal).length === 0
		? '' // nothing selected
		: editVal["title"] ?? '';

    $: about = Object.keys(editVal).length === 0
		? '' // nothing selected
		: editVal["About"] ?? '';

    $: imgFolderId = Object.keys(editVal).length === 0
		? '' // nothing selected
		: editVal["id"] ?? '';

    onMount(async () => {
        if (localStorage.getItem("password")) {
            pass = localStorage.getItem("password");
            showWhole.set(true);
        } else {
            showWhole.set(false);
        }
        ready.set(true);
    });

    export let addEdit = "Add";
    export let editVal = {};

</script>

{#if $showWhole}

    <Modal title="" open={$showDeleteModal} on:close={() => {showDeleteModal.set(false);}} autoclose size="sm" class="w-full">
        <svg class="mx-auto mb-3.5 h-11 w-11 text-gray-400 dark:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
            ><path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
            /></svg
        >
        <p class="mb-4 text-center text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
        <div class="flex items-center justify-center space-x-4">
            <Button color="light" onclick={() => {showDeleteModal.set(false);}}>No, cancel</Button>
            <Button color="red" onclick={handleDelete}>Yes, I'm sure</Button>
        </div>
    </Modal>

    {#if $ready }
        <Section name="crudcreateform">
            <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {addEdit} Location
                <br>
                {#if addEdit == "Edit"}
                    <Button pill color="red" size="xs" on:click={() => {showDeleteModal.set(true);}}>Delete Location</Button>
                {/if}
            </h2>

            <form on:submit={() => {addLocation()}}>
                <!-- <div class="w-full">
                    <Label>
                        Address or Coordinates
                        <Select class="mt-2" items={addCoorList} bind:value={addCoor}/>
                    </Label>
                </div>
                {#if addCoor == "add"}
                    <div class="w-full">
                        <Label for="address" class="mb-2">Address</Label>
                        <Input type="text" id="address" placeholder="123St Apt2" required bind:value={addLoc}/>
                    </div>
                {:else if addCoor == "coor"}
                    <div class="w-full">
                        <Label for="coordinates" class="mb-2">Coordinates</Label>
                        <Input type="text" id="coordinates" placeholder="12345, 6789" required bind:value={addLoc}/>
                    </div>
                {/if} -->
                <div class="w-full">
                        <Label for="address" class="mb-2">Address</Label>
                        <Input type="text" id="address" placeholder="123St Apt2" required bind:value={addLoc}/>
                    </div>
                <div class="w-full">
                    <Label for="title" class="mb-2">Title</Label>
                    <Input type="text" id="title" placeholder="Title" required bind:value={title}/>
                </div>
                <div class="w-full">
                    <Label for="about" class="mb-2">About</Label>
                    <Textarea type="text" id="about" placeholder="About" required bind:value={about}></Textarea>
                </div>

                <!-- Add more data fields (not used / necessary for now!) -->

                <!-- {#each Array.from({ length: dataCount }) as _, i}
                    <div class="sm:col-span-2">
                        <Label for="data-label-{i+1}" class="mb-2">Data Label {i+1}</Label>
                        <Input type="text" id="data-label-{i+1}" placeholder="data label {i+1}" required/>
                        <Label for="data-input-{i+1}" class="mb-2">Data Input {i+1}</Label>
                        <Input type="text" id="data-input-{i+1}" placeholder="data input {i+1}" required/>
                        <Button outline color="blue" size="xs" on:click={() => {
                            saveLoading.set(true);
                            const tempLabel = document.getElementById(`data-label-${i+1}`).value;
                            const tempInput = document.getElementById(`data-input-${i+1}`).value;
                            let tempData = {};
                            tempData[tempLabel] = tempInput;
                            moreData.push(tempData);
                            saveLoading.set(false);
                        }}>
                            Save
                        </Button>
                    </div>
                {/each}
                <br>

                <div class="sm:col-span-2">
                    Add data fields
                    <Button color="blue" outline size="xs" on:click={() => {dataCount++;}}>+</Button>
                    <Button color="blue" outline size="xs" on:click={() => {if (dataCount>0) dataCount--;}}>-</Button>
                </div> -->

                <br>
                <div class="sm:col-span-2">
                    {#if $loading}
                        <Button type="submit" class="w-32" disabled>
                            <Spinner color="primary" size={6}/>
                        </Button>
                    {:else}
                        <Button outline color="green" size="sm" type="submit" class="w-32">
                            {addEdit} Location
                        </Button>
                    {/if}
                </div>
            </form>
            {#if $successMessage.length > 1 || addEdit == "Edit"}
                {#if $successMessage.length > 1}
                    <br>
                    <Alert color="green">
                        <span class="font-medium">Success:</span>
                        {$successMessage}
                    </Alert>
                {/if}

                <UploadPhotos {imgFolderId}></UploadPhotos>
            {/if}

        </Section>

    {/if}

{:else}

    <Section name="crudcreateform">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Enter Password</h2>
        <form on:submit={handlePassCheck}>
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
                <Label for="name" class="mb-2">Password</Label>
                <Input type="text" id="name" placeholder="password" required bind:value={pass}/>
            </div>
            <Button type="submit" class="w-32">
                Submit
                {#if $checkingPass}
                    <Spinner size="xs" />
                {/if}
            </Button>
            </div>
        </form>
    </Section>

{/if}