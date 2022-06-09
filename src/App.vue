<template>
  <div class="img">
    <img src="../src/assets/pokemon-logo.png" alt="logo" />
  </div>
  <div class="input-group mb-3 search">
    <input
      type="text"
      class="form-control"
      aria-label="Text input with dropdown button"
      placeholder="Pesquisar"
      v-model="search"
    />
    <button
      class="btn btn-success dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Dropdown
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
      <li><hr class="dropdown-divider" /></li>
      <li><a class="dropdown-item" href="#">Separated link</a></li>
    </ul>
  </div>
  <div>
    <div class="card_content row g-3">
      <div style="width: 22rem" v-for="pokemon in filtered" :key="pokemon.name">
        <div class="card" @click="show_pokemon">
          <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${get_id(
              pokemon
            )}.png`"
            :alt="pokemon.name"
            class="PokeImg"
          />
          <h2 class="card-title text-center">{{ get_name(pokemon) }}</h2>
        </div>
      </div>
    </div>
    <m-dialog v-model="modalDados" v-if="selected_pokemon">
      <img
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected_pokemon.id}.png`"
        :alt="selected_pokemon.name"
        class="PokeImg"
      />
      <p>teste</p>
      {{ selected_pokemon }}
    </m-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "App",

  data() {
    return {
      pokemons: [],
      search: "",
      modalDados: false,
      selected_pokemon: null,
    };
  },
  mounted() {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=20").then((response) => {
      this.pokemons = response.data.results;
    });
  },
  methods: {
    get_id(pokemon) {
      return pokemon.url.split("/")[6];
    },
    get_name(pokemon) {
      return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    },
    show_pokemon(name) {
      console.log("teste");
      console.log(this.selected_pokemon);
      this.modalDados = true;
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((response) => {
        this.selected_pokemon = response.data;
      });
    },
  },
  computed: {
    filtered() {
      return this.pokemons.filter((item) => {
        return item.name.includes(this.search);
      });
    },
  },
};
</script>

<style>
.verMais {
  margin-top: 30px;
}
.img {
  width: 100%;
  justify-content: center;
  display: flex;
  padding: 20px;
}
.search {
  padding: 20px;
  width: fit-content;
  margin: 0 !important;
}
.card-title {
  position: relative;
  bottom: 0 !important;
  top: 15px;
}
.PokeImg {
  width: 80%;
}
.card {
  width: 30vh;
  height: 40vh;
  background-color: white;
  margin-top: 5vh;
  margin-left: 3vh;
  padding: 2.5vh;
  border-radius: 20px !important;
  align-items: center;
}
.card_content {
  width: 100%;
}
body {
  margin: 0;
}
#app {
  background: linear-gradient(
      to bottom right,
      rgba(33, 123, 191, 1) 0%,
      rgba(59, 109, 148, 1) 50%,
      rgba(151, 199, 235, 1) 100%
    )
    no-repeat center center fixed !important;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover !important;
  background-position: center;
  min-height: 100vh;
}
</style>
