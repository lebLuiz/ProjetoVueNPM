<template>
    <div>
        <input @change="onChange" v-model="valorCopy" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "formata-valor",

    props: {
        valor: {
            required: true,
            type: [String, Number]
        }
    },

    mounted() {
        this.valorCopy = this.padraoMoedaBrasil.format(this.valorCopy);
    },

    data() {
        return {
            valorCopy: this.valor as any,
            padraoMoedaBrasil: new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2
            }) as any,
        };
    },
    
    methods: {
        onChange({ target }: any) {
            this.valorCopy = this.padraoMoedaBrasil.format(target.value);
        }
    },
});
</script>

<style scoped>
</style>