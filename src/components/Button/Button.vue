<template>
    <button :class="[className, tratarClassesBtn]" :title="title"
        :disabled="disabled || loading" @click="respostaClick">
        <slot v-if="$slots.default"></slot>
        <span v-else>{{ textoComputado }}</span>
    </button>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'Button',

    props: { 
        text: {
            type: String,
            required: false,
        },
        typeButton: {
            type: String,
            default: 'default',
            validator: function (value: string) {
                return ['default', 'rounded', 'text'].indexOf(value) !== -1
            }
        },
        typeColor: {
            type: String,
            default: 'primary'
        },
        plain: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
            default: 'default',
            validator: function (value: string) {
                return ['default', 'medium', 'small', 'mini'].indexOf(value) !== -1
            }
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            required: false,
        },
        className: {
            type: [String, Object, Array]
        },

        maxWidthNormal: { type: Boolean }
    },

    emits: ['onClick'],

    setup(props: any, { emit }: any) {
        const tratarClassesBtn = computed(() => {
            return {
                '--primary': props.typeColor === 'primary' && props.typeButton != 'text' ? true : false,
                '--secondary': props.typeColor === 'secondary' && props.typeButton != 'text' ? true : false,
                '--danger': props.typeColor === 'danger' && props.typeButton != 'text' ? true : false,
                '--success': props.typeColor === 'success' && props.typeButton != 'text' ? true : false,

                '--plain': props.plain && props.typeButton != 'text',

                '--medium': props.size === 'medium',
                '--small': props.size === 'small',
                '--mini': props.size === 'mini',

                '--disabled': props.disabled || props.loading,

                '--max-width-normal': props.maxWidthNormal,

                '--rounded-ball': props.typeButton == 'rounded',
                '--text': props.typeButton == 'text',
            };
        });

        const textoComputado = computed(() => {
            let textoRetorno: string = props.text;

            if (props.loading) {
                if (props.typeButton == 'rounded') textoRetorno = "...";
                else if (navigator.language.indexOf("pt") != -1) textoRetorno = "Carregando...";
                else if (navigator.language.indexOf("es") != -1) textoRetorno = "Cargando...";
                else textoRetorno = "Loading...";
            }

            return textoRetorno
        });

        function respostaClick() {
            if (!props.disabled && !props.loading) emit('onClick');
        };

        return {
            tratarClassesBtn,
            textoComputado,
            respostaClick,
        };
    },
})

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

$larguraMaxMobile: 425px;

$corBranca: #FFFFFF;
$corAmarelaPadrao: #FBBE2F;
$corVermelha: #EB5757;
$corVerde: #31D0AD;
$corPreto: #000000;
$corCinza: #757575;
$corBordaDesabilitado: #3838381c;

@mixin configDesabilitado($background, $color, $colorBorder) {
    cursor: not-allowed;
    background: $background;
    color: $color;
    border: 0.1px solid $colorBorder;
}

button {
    background: $corAmarelaPadrao;
    color: $corBranca;
    
    box-shadow: 0px 1px 24px #2322271a;
    border-radius: 40px;
    border: none;
    outline: none;
    cursor: pointer;

    width: 100%;
    max-width: $larguraMaxMobile;
    min-height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: 'Montserrat';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;

    line-height: 17px;
    text-align: center;

    &.--rounded-ball {
        border-radius: 50%;
        height: 70px;
        width: 70px;
        font-size: 24px;

        font-weight: 700;
        line-height: 44px;
    }

    &.--text {
        background: transparent;
        box-shadow: none;
        border-radius: 0px;
        color: $corPreto;
        height: auto;
        width: auto;
        max-width: none;
        min-height: auto;
        padding: 0px;
        text-decoration: underline;
        &.--disabled {
            cursor: not-allowed;
            color: $corCinza;
        }
    }

    &.--disabled:not(.--text) {
        cursor: not-allowed;
        @include configDesabilitado($corAmarelaPadrao, $corBranca, #3838381c);
    }

    &.--primary {
        background: $corAmarelaPadrao;
        color: $corBranca;
        &.--plain {
            background: #FFF2D3;
            border: 1px solid $corAmarelaPadrao;
            color: #916603;
        }
        &.--disabled {
            cursor: not-allowed;
            @include configDesabilitado(#fbbe2fa6, #00000040, $corBordaDesabilitado);
        }
        &:hover:not(.--disabled) {
            background: #ffc849;
            transition: background-color .3s ease;
        }
    }

    &.--secondary {
        background: $corBranca;
        color: $corPreto;
        &.--plain {
            background: #EBEBEB;
            border: 1px solid #A5A5A5;
        }
        &.--disabled {
            cursor: not-allowed;
            @include configDesabilitado(#e5e5e5a8, #00000063, $corBordaDesabilitado);
        }
        &:hover:not(.--disabled) {
            background: #f4f4f5;
            transition: background-color .3s ease;
        }
    }

    &.--danger {
        background: $corVermelha;
        color: $corBranca;
        &.--plain {
            background: #FEE7E7;
            border: 1px solid $corVermelha;
            color: $corVermelha;
        }
        &.--disabled {
            cursor: not-allowed;
            @include configDesabilitado(#ed7a7a, $corBranca, $corBordaDesabilitado);
        }
        &:hover:not(.--disabled) {
            background: #f96565;
            transition: background-color .3s ease;
            &.--plain {
                background: $corVermelha;
                color: $corBranca;
            }
        }
    }

    &.--success {
        background: $corVerde;
        color: $corPreto;
        &.--plain {
            background: #EFFFF1;
            border: 1px solid $corVerde;
            color: $corCinza;
        }
        &.--disabled {
            cursor: not-allowed;
            @include configDesabilitado(#71e9cf, #383838a8, $corBordaDesabilitado);
        }
        &:hover:not(.--disabled) {
            background: #5ad9bd;
            transition: background-color .3s ease;

            &.--plain { color: $corPreto; }
        }
    }

    &.--medium {
        min-height: 34px;
    }
    &.--small {
        min-height: 24px;
        font-size: calc(35% + 0.8vmin);
    }
    &.--mini {
        height: 20px;
        width: 40px;
        font-size: calc(30% + 0.8vmin);

        &.--rounded-ball {
            width: auto;
            height: auto;
            padding: 0.813rem;
        }
    }

    &.--max-width-normal {
        max-width: none;
    }

}

@media only screen and (max-width: 550px) {
    button {
        &.--rounded-ball:not(.--mini) {
            width: 24px;
            height: 24px;
            min-height: 0px;
            line-height: normal;
            font-size: 14px;
        }
    }
}

</style>