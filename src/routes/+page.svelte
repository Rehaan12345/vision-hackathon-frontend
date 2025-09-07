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
    import { polys } from "$lib/static.js";
    
    let c = "reps";

</script>

<Map polys={polys}></Map>