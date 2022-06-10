<template>
  <div class="img">
    <img src="../src/assets/pokemon-logo.png" alt="logo" />
    <p class="d-none">{{evolution}}</p>
  </div>
  <div class="input-group mb-3 search">
    <input
      type="text"
      class="form-control"
      aria-label="Text input with dropdown button"
      placeholder="Pesquisar"
      v-model="search"
    />
  </div>
  <div>
    <div class="card_content row g-3" v-if="typeFilter == false">
      <div style="width: 22rem" v-for="pokemon in filtered" :key="pokemon.name">
        <div class="card" @click="show_pokemon(pokemon.name)">
          <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${get_id(
              pokemon
            )}.png`"
            :alt="pokemon.name"
            class="PokeImgCard"
          />
          <h2 class="card-title text-center">{{ get_name(pokemon) }}</h2>
        </div>
      </div>
    </div>
    <div class="card_content row g-3" v-else>
      <div style="width: 22rem" v-for="pokemon in filtered" :key="pokemon.type">
        <div class="card" @click="show_pokemon(pokemon.name)">
          <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${get_id(
              pokemon
            )}.png`"
            :alt="pokemon.name"
            class="PokeImgCard"
          />
          <h2 class="card-title text-center">{{ get_name(pokemon) }}</h2>
        </div>
      </div>
    </div>
    <!-- <paginate
      v-model="page"
      :page-count="totalPages"
      :page-range="3"
      :margin-pages="2"
      :prev-text="'Voltar'"
      :next-text="'Avançar'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    >
    </paginate> -->
    <m-dialog
      class="modal_content"
      v-model="modalDados"
      v-if="selected_pokemon"
    >
      <h2 class="text-center">{{ get_name(selected_pokemon) }}</h2>
      <img
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected_pokemon.id}.png`"
        :alt="selected_pokemon.name"
        class="PokeImgModal"
      />
      <br />
      <span>Types: </span>
      <button
        v-for="type in selected_pokemon.types"
        :key="type.slot"
        :type="type.type.name"
        class="btn btn-primary pokeData"
        @click="typeFilter(selected_pokemon.type)"
      >
        {{ type.type.name }}
      </button>

      <br />
      <span>Abilities: </span>
      <button
        v-for="ability in selected_pokemon.abilities"
        :key="ability.slot"
        :ability="ability.ability.name"
        class="btn btn-primary pokeData"
        disabled
      >
        {{ ability.ability.name }}
      </button>

      <br />
      <span>Weight: </span>
      <button class="btn btn-primary pokeData" disabled>
        {{ (selected_pokemon.weight * 0.1).toFixed(1) }} Kg
      </button>
      <br />
      <span>Height: </span>
      <button class="btn btn-primary pokeData" disabled>
        {{ (selected_pokemon.height * 0.1).toFixed(1) }} m
      </button>
      <br />
      <span>Speed: </span>
      <button class="btn btn-primary pokeData" disabled>
        {{ selected_pokemon.stats.stat }}
      </button>

      <div
        v-for="(evolution_detail, index) in evolutions()"
        :key="`evolution-${index}`"
      >
        <div v-if="typeof evolution_detail == 'object'">
          <div :pokemon="evolution_detail"></div>
        </div>
        <div v-else>
          <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected_pokemon.id++}.png`"
            :alt="selected_pokemon.name--"
            class="PokeImgModal"
          />
          <h3 class="text-center">Level UP on {{ evolution_detail }}</h3>
        </div>
      </div>
      <img
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selected_pokemon.id--}.png`"
        :alt="selected_pokemon.name--"
        class="PokeImgModal"
      />
    </m-dialog>
  </div>
</template>

<script>
// import Paginate from "vuejs-paginate-next";
import axios from "axios";
// const page = ref(1);
// const perPage = ref(5);
export default {
  name: "App",
  data() {
    return {
      pokemons: [],
      pokemonsLocal: [],
      search: "",
      modalDados: false,
      selected_pokemon: null,
      evolution: null,
      typeFilter: false,
      type: this.selected_pokemon,
    };
  },
  mounted() {
    this.verificaLocalStorage()
  },
  methods: {
    verificaLocalStorage() {
      if (localStorage.pokesDB == null) {
      axios
        .get("https://pokeapi.co/api/v2/pokemon?limit=1126")
        .then((response) => {
          this.pokemons = response.data.results;
          this.savePokesDB();
          console.log("busca na API")
        });
    } else {
      this.getPokesDB();
    }
    },
    get_id(pokemon) {
      return pokemon.url.split("/")[6];
    },
    get_name(pokemon) {
      return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    },
    show_pokemon(name) {
      if (name) {
        this.modalDados = true;
      }
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((response) => {
          console.log(response.data);

          this.selected_pokemon = response.data;
          this.get_level();
        });
    },
    savePokesDB() {
      var pokemons = JSON.stringify(this.pokemons);
      localStorage.setItem("pokesDB", pokemons);
    },
    getPokesDB() {
      console.log("ok");
      this.pokemons = localStorage.getItem("pokesDB")
        ? JSON.parse(localStorage.getItem("pokesDB"))
        : [];
    },
    get_level() {
      axios
        .get(
          `https://pokeapi.co/api/v2/pokemon-species/${this.selected_pokemon.id}`
        )
        .then((response) => {
          axios.get(response.data.evolution_chain.url).then((response) => {
            this.evolution = response.data.chain;
          });
        });
    },
    evolutions() {
      let chain = [];
      let evolution = this.evolution;
      try {
        chain.push(evolution.species);
      } catch (error) {
        console.log(error);
      }

      while (evolution.species) {
        if (evolution.evolves_to.length > 0) {
          evolution = evolution.evolves_to[0];
          if (
            evolution.evolution_details.length > 0 &&
            evolution.evolution_details[0].min_level
          ) {
            chain.push(evolution.evolution_details[0].min_level);
          }
          if (evolution.species) {
            chain.push(evolution.species);
          }
        } else {
          break;
        }
      }
      return chain;
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
.pokeData {
  margin-left: 10px;
  margin-bottom: 10px;
}
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
.PokeImgCard {
  width: 80%;
}
.PokeImgModal {
  width: 50%;
  flex-direction: column;
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
.modal_content {
  display: flex;
  text-align: center;
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
