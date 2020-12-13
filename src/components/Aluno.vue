<template>
  <v-data-table :headers="headers" :items="alunos" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Alunos matriculados</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="700px">

          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Novo Aluno</v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.id" label="Id"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="8">
                    <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.idade" label="Idade"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.data" label="Data da matricula"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">  
          <v-card>
            <v-card-title class="headline">Tem certeza que quer deletar este aluno?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sim</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary" @click="inicializar">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
    name: "Alunos",
    data () {
        return {
            dialog: false,
            dialogDelete: false,
            headers: [
              { text: 'Id', value: 'id',},
              { text: 'Nome', value: 'name' },
              { text: 'Idade', value: 'idade' },
              { text: 'Data da matrícula', value: 'data' },
              { text: 'Ações', value: 'actions', sortable: false },
            ],
            alunos: [], 
            editedIndex: -1,
            editedItem: {
              id: 0,
              name: '',
              idade: '',
              data: '',
            },
            defaultItem: {
              id: 0,
              name: '',
              idade: '',
              data: '',
            },
        } 
    },
    methods: {
        inicializar() {
            axios("http://localhost:3000/alunos")
            .then((response) => {
                this.alunos = response.data;
            })
            .catch((error) => console.log(error))
        },

        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },

        save() {
            if (this.editedIndex > -1) { //alteracao
                axios.put("http://localhost:3000/alunos/" + this.editedItem.id, this.editedItem)
                .then(response => {
                    console.log(response);
                    Object.assign(this.alunos[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            } else {
                axios.post("http://localhost:3000/alunos", this.editedItem)
                .then(response => {
                    console.log(response);
                    this.alunos.push(this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            }
        },

        editItem(item) {
            this.editedIndex = this.alunos.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem(item) {
            this.editedIndex = item.id
            this.editedItem = Object.assign({}, item)
            console.log(this.editedIndex);
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            axios.delete("http://localhost:3000/alunos/" + this.editedIndex)
            .then(response => {
                console.log(response.data);
                this.alunos.splice(this.editedIndex, 1);
            })
            .catch(error => console.log(error));
            this.closeDelete();
        },

        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Novo Aluno" : "Editar Aluno"
        }
    },
    created() {
        this.inicializar();
    }
}
</script>