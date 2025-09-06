<script>

// @ts-nocheck

import { onMount } from 'svelte';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import { addDocument, getDocuments } from '$lib/model';
import { writable } from 'svelte/store';
import { tick } from 'svelte';
import { Modal, Spinner, Avatar, Popover, Button } from 'flowbite-svelte';
import MapModal from './MapModal.svelte';
import { HomeOutline } from "flowbite-svelte-icons"
import { getCachedImgs } from '$lib/cache';

// export let useCategory = "tech-companies";
const useCategory = "murals";

let ready = writable(false);

let showMapModal = writable(false);

const cambridge = fromLonLat([-71.10366950263109, 42.36596281768288]);
const home = fromLonLat([-71.09893937618445, 42.366479045735595]);

let map;
let docs;
let imgs = {};
let useImg = "";

let mapData;

onMount(async () => {

  docs = await getDocuments(useCategory);

  imgs = getCachedImgs();

  try {
    map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: cambridge,
        zoom: 15,
      })
    });

    ready.set(true);

    const marker = new Overlay({
      position: home,
      positioning: "center-center",
      element: document.getElementById("marker"),
      stopEvent: false,
    })
    map.addOverlay(marker);
    // console.log(marker);

    // console.log("ready");

    addAllMarkers();

  } catch (error) {
    console.log("doesn't works");
  }
  
})

async function addAllMarkers() {

  await tick(); // Very important - used to only start once the {#each} block has stopped rendering.

  for (let i = 0; i < docs.length; i++) {
    
    try {
      const currId = docs[i].id;
      console.log(currId);
      const currPos = docs[i].coords;
      console.log(currPos);
      // console.log(document.getElementById("marker"));
      console.log("marker-" + currId)
      console.log(document.getElementById('marker-' + currId));
      const marker = new Overlay({
        position: fromLonLat(currPos),
        positioning: 'center-center',
        element: document.getElementById('marker-' + currId),
        stopEvent: false,
      });
      map.addOverlay(marker);

      const currEl = new Overlay({
        position: fromLonLat(currPos),
        element: document.getElementById(currId),
      });
      map.addOverlay(currEl);
      console.log("added");
    } catch (error) {
      console.log("Failed to add map element: " + error);
    }

  }
}

const shortAbout = (about) => {
  if (about.length > 150) return about.substring(0, 149);
  return about;
}

</script>

<style>
#map {
  /* margin-top: 2rem; */
  z-index: -1;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.dot {
  border: 1px solid black;
  background-color: white;
  text-decoration: none;
  color: rgb(0, 0, 0);
  font-size: 10pt;
  /* font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; */
  letter-spacing: .5px;
  padding-left: .5rem;
  padding-right: .5rem;
  border-radius: 3px;
  max-width: 15rem;
}

.popover {
  z-index: 10000;
}

</style>

<Modal class="min-w-full" open={$showMapModal} on:close={() => {showMapModal.set(false); }} size="xl">

    <MapModal mapData={mapData}></MapModal>

</Modal>

<div id="map"></div>

{#if $ready}

  <!-- <div style="display: none;">

    <div class="overlay dot" id="home">Home</div>
    <div id="marker" title="Marker"></div>

  </div> -->

    {#each docs as d}

      <button class="dot" id={d.id}>{d.title}</button>
      <button class="profimgwrapper" style="cursor: pointer;" aria-label={d.id} id="marker-{d.id}" title={d.title} on:click={() => {mapData = d; showMapModal.set(true);}}>
        {#if imgs}

          <Avatar src={imgs[d.id][0]} />

        {/if}
      </button>
      <Popover class="w-64 text-sm font-light popover" title={d.title}>
        <p style="color: black;">{d.Location}</p>
        <hr style="margin-top: .5rem; margin-bottom: .5rem;">
        {shortAbout(d.About)} ...
        <button style="color: black; cursor:pointer" on:click={() => {mapData = d; showMapModal.set(true);}}>Read more</button>
        <img style="cursor: pointer;" on:click={() => {mapData = d; showMapModal.set(true);}} src={imgs[d.id][0]} class="col-span-2 h-full rounded-e-lg" alt="MuralPicture" />
      </Popover>

      
    {/each}
    


{:else}

<div class="NOTREADY">Loading .. <Spinner color="red" size={4}/> </div>

{/if}