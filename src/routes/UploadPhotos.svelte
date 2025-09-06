<script>
    //@ts-nocheck

    import { Label, Button, Spinner, Alert } from "flowbite-svelte";
    import { writable } from 'svelte/store';

    const SEND_URL = import.meta.env.VITE_URL;

    let imgLoading = writable(false);
    let statusMessage = writable("");

    let file = "";

    const handleSubmitImage = async (file) => {
		// if (file.length < 1) {
		// 	errorMessage.set('Please select a file.');
		// 	return -1;
		// }
        statusMessage.set("File uploading ...");
		console.log(file);
		let formData = new FormData();
        formData.append("image", file);
        formData.append("folder", imgFolderId)
        console.log(formData);

        try {
            let url = SEND_URL + 'upload-image';
            let response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            let resData = await response.json();
            console.log(resData);
            statusMessage.set(resData["message"]);
            file = "";
        } catch (error) {
            console.log('error uploading mentor img: ' + error);
            return false;
        }
	};

    export let imgFolderId = "";

</script>

<div class="w-full" style="margin-top:2rem;margin-bottom:2rem;">
    <!-- <form onsubmit={() => {await handleSubmitImage(file)}}></form> -->
    <Label>Upload Pictures</Label>
    <input
        style="border:1px solid black;border-radius:5px;"
        type="file"
        accept="image/*"
        required
        on:change={(e) => (file = e.target.files[0])}
    />
    <!-- <br> -->
    <Button
        size="md"
        outline
        color="blue"
        on:click={async () => {
            console.log(file);
            await handleSubmitImage(file);
        }}
    >
        Upload
        {#if $imgLoading}
            <Spinner size={5} color="blue" />
        {/if}
    </Button>
</div>

{#if $statusMessage.length > 1}

    <Alert color="blue">
        <span class="font-medium">Status:</span>
        {$statusMessage}
    </Alert>

{/if}