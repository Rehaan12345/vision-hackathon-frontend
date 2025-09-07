<script lang="ts">
  //@ts-nocheck
  import { onMount } from "svelte";
  import Map from "ol/Map";
  import View from "ol/View";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import VectorLayer from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import Feature from "ol/Feature";
  import Polygon from "ol/geom/Polygon";
  import { Fill, Stroke, Style } from "ol/style";
  import { tick } from 'svelte';
  import Overlay from 'ol/Overlay.js';
  import { fromLonLat } from 'ol/proj.js';
  import { Popover, Modal } from "flowbite-svelte";
  import { MapPinAltSolid, FaceGrinStarsSolid, StarSolid } from "flowbite-svelte-icons";
  import { docs, reps, distCoords, distColors } from "$lib/static.js"
  import { writable } from "svelte/store";

  let ready = writable(false);
  let showPeopleModal = writable(false);

  let map: Map;

  let showReps = [];

  let currDist;
  let currRep;

  // Helper: create polygon feature with coords + id
  function createPolygon(coords: number[][], id: string, color = "red") {
    const polygon = new Polygon([coords]).transform("EPSG:4326", "EPSG:3857");
    const feature = new Feature(polygon);
    feature.setId(id);
    feature.setStyle(
      new Style({
        stroke: new Stroke({ color, width: 3 }),
        fill: new Fill({ color: "rgba(0, 0, 255, 0.1)" }), // semi-transparent
      })
    );
    return feature;
  }

  onMount(async () => {

    ready.set(false);

    for (let i = 0; i < reps.length; i++) {
      if (reps[i].pos == "current") showReps.push(reps[i].id);
    }

    console.log(showReps);

    // console.log(polys);

    let features = [];

    for (let i = 0; i < polys.length; i++) {
      const curr = polys[i];
      const temp = createPolygon(curr.coords, curr.name, curr.color);
      features.push(temp);
    }

    // console.log(features);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
    });

    map = new Map({
      target: "map",
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: [-13100000, 4030000],
        zoom: 9,
      }),
    });

    // Handle clicks
    // map.on("singleclick", (evt) => {
    //   let clicked = false;
    //   map.forEachFeatureAtPixel(evt.pixel, (feature) => {
    //     alert("clicked " + feature.getId());
    //     clicked = true;
    //   });
    // });

    await addAllMarkers(docs);
    await addAllMarkers(reps);

    ready.set(true);
  });

  async function addAllMarkers(docs) {

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
      } catch (error) {
        console.log("Failed to add map element: " + error);
      }

    }
  }

  export let polys = [];

</script>

<style>
  #map {
    width: 100%;
    height: 100vh;
    z-index: -1;
  }
  
  .li-content {
    border: 1px solid black;
    border-radius: 10px;
    display: flex;
    gap: .5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    color: black;
  }

  .li-content:hover {
    background-color: gray;
    color: white;
  }

</style>

<Modal class="min-w-full" title="Choose Representative" open={$showPeopleModal} on:close={() => {showPeopleModal.set(false); }} size="xs">

    <ul class="list-wrapper">

    {#each reps as r}

      {#if r.district == currDist}

        <li>
          <div class="li-content">
          {#if r.id == currRep}
            <StarSolid color="yellow" class="shrink-0 h-6 w-6" /> 
            {r.name} <i>({r.pos})</i>
          {:else}
            <button id={r.id} on:click={() => {
              showReps = showReps.filter(id => id !== currRep); // Remove currRep
              showReps.push(r.id); // Add new rep
              console.log(showReps);
            }}>
              {r.name} <i>({r.pos})</i>
            </button>
          {/if}
          </div>
          
        
        </li>

      {/if}

    {/each}

  </ul>

</Modal>

<div id="map"></div>

{#each docs as d}

  {#if !showReps.includes(d.rep)}

    <!-- <button class="dot" id={d.id}></button> -->
    <button class="profimgwrapper" style="cursor: pointer;" aria-label={d.id} id="marker-{d.id}" title={d.title}>
      <MapPinAltSolid color={distColors[d.district - 1]} class="shrink-0 h-6 w-6" />
    </button>
    <Popover class="w-64 text-sm font-light popover" title={d.title}>
      <p style="color: black;">{d.description}</p>
    </Popover>

  {/if}

{/each}

{#each reps as d}

  <button class="district-reps" style="cursor: pointer; z-index: 200;" aria-label={d.id} id="marker-{d.id}" title={d.name}  on:click={() => {showPeopleModal.set(true); currDist = d.district; currRep = d.id;}}>
    <FaceGrinStarsSolid class="shrink-0 h-6 w-6"/> 
  </button>

{/each}