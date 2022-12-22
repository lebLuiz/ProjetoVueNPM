<template>
	<div id="text-form-field">
		<label>
			<span v-text="label" />
			<span v-if="labelRight" class="label-right" v-text="labelRight" />
			<slot v-else-if="!labelRight && $slots['labelRight']"
				name="labelRight" class="label-right" />
		</label>

		<OnClickOutside v-if="type != 'select' && type != 'radio'" :class="['wrapper__input', { '--max-width-normal': fieldMaxWidthNormal }]"
			@trigger="escutaAoFecharTextFormField"
			@keydown.up="clicouTeclaSelectAutocomplete('up')"
			@keydown.down="clicouTeclaSelectAutocomplete('down')"
			@keydown.enter.prevent="clicouTeclaSelectAutocomplete('enter')"
			@keydown.tab="escutaAoFecharTextFormField" >
			<div id="input-field" >
				<input v-if="type != 'textarea'"
					:class="['input', tratar_classes_input]"
					:type="clone_do_tipo_input"
					:placeholder="placeholder ? placeholder : ''"
					v-maska="mask"
					role="presentation"
					:autocomplete="autocompleteInput"
					:onpaste="onPaste"
					:ondrop="onDrop"
					aria-autocomplete="none"
					:disabled="disabled"
					:readonly="readonly"
					:maxlength="maxLength"
					:min="(type == 'number' || type == 'tel' || type == 'date' || type == 'time') ? min : Infinity"
					:max="(type == 'number' || type == 'tel' || type == 'date' || type == 'time') ? max : Infinity"
					:step="(type == 'time' && step) ? step : null"
					:value="valor_input"
					@click.stop="abrirOuFecharSelectAutocomplete(true)"
					@input="enviarRespostaInput($event, 'input')" />

				<textarea v-if="type == 'textarea'"
					:class="['input --text-area', tratar_classes_input]"
					name="textarea"
					id="textarea"
					:cols="cols"
					:rows="rows"
					:autocomplete="autocompleteInput"
					:onpaste="onPaste"
					:ondrop="onDrop"
					aria-autocomplete="none"
					:disabled="disabled"
					:readonly="readonly"
					:maxlength="maxLength"
					:placeholder="placeholder ? placeholder : ''"
					:value="valor_input"
					@input="enviarRespostaInput($event, 'input')" />

				<svg v-if="type == 'password'"
					:class="['icon-field', { '--disabled': disabled }]"
					@click="mudaTipoInputTextEPassword"
					width="24"
					height="14"
					viewBox="0 0 24 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg" >
					<path d="M12 3C9.79403 3 8 4.79403 8 7.00005C8 9.20607 9.79403 11.0001 12 11.0001C14.2061 11.0001 16.0001 9.20607 16.0001 7.00005C16.0001 4.79403 14.2061 3 12 3ZM12 10.0001C10.346 10.0001 9 8.65411 9 7.0001C9 5.34609 10.346 4.00005 12 4.00005C13.6541 4.00005 15.0001 5.34609 15.0001 7.0001C15.0001 8.65411 13.6541 10.0001 12 10.0001Z"
						fill="black" />
					<path d="M23.9111 6.71612C23.7221 6.4411 19.18 0 11.9999 0C5.83883 0 0.348744 6.40411 0.11774 6.67712C-0.0392467 6.86312 -0.0392467 7.13613 0.11774 7.32311C0.348744 7.59612 5.83883 14.0002 11.9999 14.0002C18.1611 14.0002 23.6511 7.59612 23.8821 7.32311C24.0271 7.15113 24.0401 6.90212 23.9111 6.71612ZM11.9999 13.0002C7.06088 13.0002 2.36478 8.29016 1.17179 7.00014C2.36281 5.70914 7.05389 1.00005 11.9999 1.00005C17.779 1.00005 21.8581 5.70314 22.8541 6.97314C21.7041 8.22214 16.981 13.0002 11.9999 13.0002Z"
						fill="black" />
				</svg>

				<svg v-if="MOSTRAR_ICON_CLEARABLE"
					@click.prevent.stop="limparValorPorClearable"
					class="svg-icon-clearable"
					width="17" height="17" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M14 28C6.28009 28 0 21.7199 0 14C0 6.28009 6.28009 0 14 0C21.7199 0 28 6.28009 28 14C28 21.7199 21.7199 28 14 28ZM14 1.75C7.24503 1.75 1.75 7.24503 1.75 14C1.75 20.755 7.24503 26.25 14 26.25C20.755 26.25 26.25 20.755 26.25 14C26.25 7.24503 20.755 1.75 14 1.75Z" fill="#757575"/>
					<path d="M9.66971 19.2062C9.44562 19.2062 9.22153 19.1212 9.05127 18.9497C8.70947 18.6079 8.70947 18.0537 9.05127 17.7119L17.7137 9.04932C18.0557 8.70752 18.6098 8.70752 18.9516 9.04932C19.2934 9.39111 19.2934 9.94525 18.9516 10.2873L10.289 18.9497C10.1164 19.1212 9.89252 19.2062 9.66971 19.2062Z" fill="#757575"/>
					<path d="M18.3306 19.2051C18.1067 19.2051 17.8826 19.1201 17.7124 18.9486L9.04996 10.2872C8.70795 9.94541 8.70795 9.39127 9.04996 9.04948C9.39176 8.70747 9.9459 8.70747 10.2877 9.04948L18.9501 17.7119C19.2921 18.0537 19.2921 18.6078 18.9501 18.9496C18.7788 19.1201 18.5547 19.2051 18.3306 19.2051Z" fill="#757575"/>
				</svg>

				<svg v-if="comIconeDeBusca && type != 'textarea'"
					:class="['icon-field', { '--search': !disabled, '--disabled': disabled },]"
					@click.prevent="enviarRespostaInput($event, 'clickBusca')"
					xmlns="http://www.w3.org/2000/svg"
					height="18px"
					viewBox="0 0 24 24"
					width="18px"
					fill="#000000" >
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
				</svg>
			</div>

			<transition name="slide">
				<ul v-if="validar_autocomplete_input && mostrar_opcoes_select_autocomplete && type != 'textarea'"
					id="dropdown-list__element" :class="['autocomplete', { 'is-active': validar_autocomplete_input && mostrar_opcoes_select_autocomplete }]"
					:ref="el => { if(el) ref_dropdown_select_autocomplete = el }"
					@keydown.up="clicouTeclaSelectAutocomplete('up')"
					@keydown.down="clicouTeclaSelectAutocomplete('down')"
					@keydown.enter.prevent="clicouTeclaSelectAutocomplete('enter')">
					<li v-for="(itemMomento, index) in opcoes_select" :key="index"
						:ref="el_li => armazenandoReferenciasOpcoesSelectAutocomplete(el_li, index, itemMomento)"
						:class="['dropdown-list__item autocomplete', {
							'--selected': verificarItemSelecionado(itemMomento),
							'--disabled': verificarItemDesabilitado(index),
							'--first': index == 0,
							'--last': index == opcoes_select.length - 1,
						}]"
						@click.stop="selecionouOpcaoSelectAutocomplete(itemMomento, index)">
						<span
							v-if="!$slots[keyText]"
							v-text="keyText ? itemMomento[keyText] : itemMomento" />

						<slot v-else
							:name="keyText"
							:dado="itemMomento"
							:index="index"></slot>
					</li>
				</ul>
			</transition>
		</OnClickOutside>


		<OnClickOutside v-if="type == 'select'"
			id="dropdown"
			:class="{
				'--select-max-width-normal': fieldMaxWidthNormal,
				'is-active': mostrar_opcoes_select_autocomplete,
				'--disabled': disabled,
			}"
			@trigger="escutaAoFecharTextFormField"
			@click.stop="abrirOuFecharSelectAutocomplete"
			@keydown.up="clicouTeclaSelectAutocomplete('up')"
			@keydown.down="clicouTeclaSelectAutocomplete('down')"
			@keydown.enter.prevent="clicouTeclaSelectAutocomplete('enter')"
			@keydown.tab="escutaAoFecharTextFormField" >

			<div id="dropdown-select">
				<div v-if="multiple || filterable" id="template-filter" @click.stop="abrirOuFecharSelectAutocomplete" >
					<transition-group v-if="multiple" name="slide" mode="out-in">
						<span class="option-inserted" v-for="(opc, i) in opcoes_select_inseridas" :key="i" >
						<span class="lbl">{{ keyText ? opc[keyText] : opc }}</span>
							<div class="close-x" @click.stop="removerItem(i)">
								<div class="arrow" />
								<div class="arrow --two" />
							</div>
						</span>
					</transition-group>

					<span v-if="multiple && !filterable && modelValue && modelValue.length == 0" class="placeholder">{{ placeholder }}</span>
					<input v-if="filterable"
						class="inpt-filter"
						@focus.stop="abrirOpcoesSelectAutocomplete"
						@click.stop="abrirOpcoesSelectAutocomplete"
						:placeholder="placeholder_ou_texto_selecionado"
						autocomplete="off"
						aria-autocomplete="none"
						type="text"
						:disabled="disabled"
						:readonly="readonly"
						v-model="filtro_busca"
						@input="enviarRespostaInput($event, 'inputFilterSelect')" />
				</div>

				<span v-if="!multiple && !filterable"
					id="select-label" class="select"
					@click.stop="abrirOuFecharSelectAutocomplete" >
					{{ placeholder_ou_texto_selecionado }}
				</span>

				<svg v-if="MOSTRAR_ICON_CLEARABLE"
					@click.prevent.stop="limparValorPorClearable"
					class="svg-icon-clearable"
					width="17" height="17" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M14 28C6.28009 28 0 21.7199 0 14C0 6.28009 6.28009 0 14 0C21.7199 0 28 6.28009 28 14C28 21.7199 21.7199 28 14 28ZM14 1.75C7.24503 1.75 1.75 7.24503 1.75 14C1.75 20.755 7.24503 26.25 14 26.25C20.755 26.25 26.25 20.755 26.25 14C26.25 7.24503 20.755 1.75 14 1.75Z" fill="#757575"/>
					<path d="M9.66971 19.2062C9.44562 19.2062 9.22153 19.1212 9.05127 18.9497C8.70947 18.6079 8.70947 18.0537 9.05127 17.7119L17.7137 9.04932C18.0557 8.70752 18.6098 8.70752 18.9516 9.04932C19.2934 9.39111 19.2934 9.94525 18.9516 10.2873L10.289 18.9497C10.1164 19.1212 9.89252 19.2062 9.66971 19.2062Z" fill="#757575"/>
					<path d="M18.3306 19.2051C18.1067 19.2051 17.8826 19.1201 17.7124 18.9486L9.04996 10.2872C8.70795 9.94541 8.70795 9.39127 9.04996 9.04948C9.39176 8.70747 9.9459 8.70747 10.2877 9.04948L18.9501 17.7119C19.2921 18.0537 19.2921 18.6078 18.9501 18.9496C18.7788 19.1201 18.5547 19.2051 18.3306 19.2051Z" fill="#757575"/>
				</svg>

				<svg id="svg-icon-arrow" :class="{ 'is-active': mostrar_opcoes_select_autocomplete }"
					width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg" >
					<path d="M0.5 18.5L9.5 9.5L0.499999 0.499999" stroke="#FBBE2F" />
				</svg>
			</div>

			<transition name="slide">
				<ul v-if="mostrar_opcoes_select_autocomplete"
					id="dropdown-list__element" :class="{ 'is-active': mostrar_opcoes_select_autocomplete }"
					:ref="el => { if(el) ref_dropdown_select_autocomplete = el }"
					@keydown.up="clicouTeclaSelectAutocomplete('up')"
					@keydown.down="clicouTeclaSelectAutocomplete('down')"
					@keydown.enter.prevent="clicouTeclaSelectAutocomplete('enter')">
					<li v-if="opcoes_select?.length == 0"
						class="dropdown-list__item --no-data">
						<svg width="24" height="24" viewBox="0 0 33 36" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M24.401 6.21184L24.3936 6.20481C24.2539 6.07228 24.0614 5.99813 23.8608 6.00026C23.8335 5.9992 23.806 6.00133 23.7796 6.00729H11.8492C9.72415 6.00793 8.00189 7.59444 8.00073 9.55189V32.4554C8.00189 34.4126 9.72415 35.9989 11.8492 36H29.1523C31.2775 35.9989 33 34.4126 33.0007 32.4554V14.3983C32.9993 14.2177 32.9225 14.0444 32.7863 13.9145L24.401 6.21184ZM24.6009 8.31802L30.4919 13.7302H26.969C25.6627 13.7267 24.6046 12.7522 24.6009 11.549V8.31802ZM29.1523 34.6229H11.8492C10.5426 34.6195 9.48496 33.645 9.48079 32.4416V9.53804C9.48496 8.33506 10.5426 7.36049 11.8492 7.35665H23.1206V11.549C23.1217 13.5062 24.8442 15.0927 26.969 15.0936H31.5207V32.4416C31.5195 33.646 30.46 34.6219 29.1523 34.6229Z" fill="#000000"/>
							<path d="M15.0007 27C16.7399 25.4908 21.1746 23.3778 25.0007 27" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
							<line x1="1" y1="-1" x2="5.71707" y2="-1" transform="matrix(0.744382 -0.667754 0.633619 0.773645 14 22.209)" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
							<line x1="1" y1="-1" x2="5.77231" y2="-1" transform="matrix(0.749233 -0.662306 0.63918 0.769057 23 22.209)" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
							<line x1="1" y1="-1" x2="5.74475" y2="-1" transform="matrix(-0.680877 -0.732398 0.700683 -0.713473 18.5925 20.9395)" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
							<line x1="1" y1="-1" x2="5.7912" y2="-1" transform="matrix(-0.686225 -0.727389 0.705903 -0.708309 27.6604 20.9395)" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
							<line x1="7.02688" y1="8.93624" x2="2.5886" y2="8.19353" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
							<line x1="7.42959" y1="6.61814" x2="1.65717" y2="3.62997" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
							<line x1="9.08595" y1="5.03646" x2="6.19341" y2="1.58926" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
						</svg>
						<span v-text="texto_sem_dados_select_autocomplete"/>
					</li>
					<li v-for="(itemMomento, index) in opcoes_select" :key="index"
						:ref="el_li => armazenandoReferenciasOpcoesSelectAutocomplete(el_li, index, itemMomento)"
						class="dropdown-list__item"
						:class="{
							'--selected': verificarItemSelecionado(itemMomento),
							'--disabled': verificarItemDesabilitado(index),
							'--first': index == 0,
							'--last': index == opcoes_select.length - 1,
						}"
						@click.stop="selecionouOpcaoSelectAutocomplete(itemMomento, index)">

						<span
							v-if="!$slots[keyText]"
							v-text="keyText ? itemMomento[keyText] : itemMomento" />

						<slot v-else
							:name="keyText"
							:dado="itemMomento"
							:index="index"></slot>
					</li>
				</ul>
			</transition>
		</OnClickOutside>



		<div v-if="type == 'radio'" :class="['container-radio', { '--contains-options': options.length > 1 }]">
			<div v-for="(item, index) in options" :key="index" @click="selecionouOpcaoRadio(item, index)" >
				<input id="id-radio"
					name="radio"
					type="radio"
					:autocomplete="autocompleteInput"
					:onpaste="onPaste"
					:ondrop="onDrop"
					aria-autocomplete="none"
					:class="{ '--disabled': verificarItemDesabilitado(index) }"
					:disabled="verificarItemDesabilitado(index)"
					:checked="verificarItemChecadoRadio(item)"
					:value="modelValue" />

				<label for="radio" :class="['radio-label', tratarCoresClasses(item)]">
					{{ verificarSeDadoEstaObjeto(item) ? item[keyText] : item }}
				</label>
			</div>
		</div>

		<transition name="slide-fade" mode="in-out">
			<slot v-if="!messageNotification && !messageError && $slots['notification']"
				name="notification" />
			<span v-else-if="!$slots['notification'] && (messageNotification && messageNotification != '') || (messageError && messageError != '')"
				:class="['span-msg', { 
					'--error': messageError && messageError != '',
					'--max-width': fieldMaxWidthNormal
				}]">
				{{ messageError ? messageError : messageNotification }}
			</span>
		</transition>
	</div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, Ref } from "vue";
import { vMaska } from "maska";
import { OnClickOutside } from "@vueuse/components";

export default defineComponent({
	name: "TextFormField",

	directives: {
		maska: vMaska,
	},

	components: { OnClickOutside },

	props: {
		label: {
			type: String,
			required: true,
		},
		labelRight: {
			type: String,
		},

		type: {
			type: String,
		},

		autocomplete: {
			type: Boolean,
		},

		autocompleteInput: {
			type: String,
			default: "off"
		},
		onPaste: {
			type: String,
		},
		onDrop: {
			type: String,
		},

		min: {
			type: [Number, String],
			default: Infinity,
		},
		max: {
			type: [Number, String],
			default: Infinity,
		},

		step: {
			type: [Number, String],
		},

		modelValue: {
			type: [String, Number, Array, Object, Boolean],
		},

		placeholder: {
			type: String,
			required: false,
		},

		disabled: {
			type: Boolean,
			required: false,
		},
		readonly: { type: Boolean },

		comIconeDeBusca: { type: Boolean },

		clearable: {
			type: Boolean,
			default: false,
		},

		maxLength: {
			type: Number,
			default: Infinity,
		},

		mask: {
			type: [String, Object],
			required: false,
		},
		onlyNumbers: {
			type: Boolean
		},

		// Props do textarea:
		cols: {
			type: Number,
			default: 30,
		},
		rows: {
			type: Number,
			default: 5,
		},

		options: {
			type: Array,
			default: () => [],
		},
		keyValue: { type: String },
		keyText: { type: String },
		getOnlyKeyValue: {
			type: Boolean,
			default: false,
		},
		indexOptionsDisabled: {
			type: Array,
			default: () => [],
		},

		multiple: { type: Boolean },
		filterable: { type: Boolean },

		color: {
			type: String,
			default: () => "default",
		},

		messageNotification: {
			type: String,
			required: false,
		},
		messageError: {
			type: String,
			required: false,
		},

		webkitTextSecurity: {
			type: Boolean,
			default: false
		},

		filterMethod: { type: Function },

		fieldMaxWidthNormal: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		"update:modelValue",
		"onInput",
		"onChange",
		"onClickBusca",
		"onKeyUpEnter"
	],

	mounted() {
		if (this.type) this.clone_do_tipo_input = this.type;
	},

	data() {
		return {
			clone_do_tipo_input: "",
			filtro_busca: "",
			mostrar_opcoes_select_autocomplete: false as boolean,

			ref_dropdown_select_autocomplete: null as null | Ref<any>,
			ref_opcoes_select_autocomplete: {} as Ref<any> | Array<any>,

			posicao_elemento_opcao_ativada_momento_select_autocomplete: 0 as number,
		}
	},

	watch: {
		type(newVal, oldVal) {
			if (newVal != oldVal) this.clone_do_tipo_input = newVal;
		},

		modelValue(newVal) {
			if (newVal == null && this.autocomplete && !this.filterable) this.filtro_busca = "";
		},

		mostrar_opcoes_select_autocomplete(newVal) {
			if (!newVal) this.posicao_elemento_opcao_ativada_momento_select_autocomplete = 0;
		}
	},

	computed: {
		v_model_diferente_que_valores_nullos(): boolean {
			return (this.modelValue !== null &&
					this.modelValue !== undefined &&
					this.modelValue !== "" &&
					String(this.modelValue)?.length > 0);
		},

		text_form_field_esta_habilitado(): boolean {
			return (!this.disabled && !this.readonly);
		},

		valor_input(): any {
			if (this.autocomplete && !this.filterable) return this.removerEmojisEmInput(this.filtro_busca);
			else return (typeof this.modelValue == 'string') ? this.removerEmojisEmInput(this.modelValue) : this.modelValue;
		},

		tratar_classes_input(): object {
			return {
				"--disabled": this.disabled,
				"--password-type": this.type === "password",
				"--autocomplete-digit": (this.type === 'text' && this.validar_autocomplete_input && this.mostrar_opcoes_select_autocomplete),
				"--webkit-text-security": this.type === 'text' && this.webkitTextSecurity,
			};
		},

		texto_sem_dados_select_autocomplete(): string {
			if (navigator.language.indexOf("pt") != -1)
				return "Sem dados";
			else if (navigator.language.indexOf("es") != -1)
				return "Sin datos";
			else
				return "No data";
		},

		placeholder_ou_texto_selecionado(): any {
			let resposta_retorno: any = "";

			if (this.multiple) {
				if (this.placeholder) {
					resposta_retorno = this.placeholder;
				} else {
					if (navigator.language.indexOf("pt") != -1)
						resposta_retorno = "Escolha a opção";

					else if (navigator.language.indexOf("es") != -1)
						resposta_retorno = "Elegir opción";
						
					else
						resposta_retorno = "Choose the option";
				}
			} else {
				if (this.v_model_diferente_que_valores_nullos) {
					if (this.getOnlyKeyValue) {
						const encontra_valor_valorado: any = this.options.find((dado: any) => dado[this.keyValue || ""] === this.modelValue);
						
						if (encontra_valor_valorado != undefined)
							resposta_retorno = encontra_valor_valorado[this.keyText || ""];
						else if (this.placeholder)
							resposta_retorno = this.placeholder;
						else {
							if (navigator.language.indexOf("pt") != -1)
								resposta_retorno = "Selecionar";

							else if (navigator.language.indexOf("es") != -1)
								resposta_retorno = "Seleccione";

							else
								resposta_retorno = "Select";
						}
						// @ts-ignore
					} else if ((this.keyValue && this.keyText) && (this.modelValue[this.keyValue] && this.modelValue[this.keyText])) {
						// @ts-ignore
						resposta_retorno = this.modelValue[this.keyText];
					} else if (this.modelValue != null && this.modelValue != "") {
						resposta_retorno = this.modelValue;
					} else {
						resposta_retorno = this.placeholder;
					}
				} else if (this.placeholder) {
					resposta_retorno = this.placeholder;
				} else {
					if (navigator.language.indexOf("pt") != -1)
						resposta_retorno = "Selecionar";

					else if (navigator.language.indexOf("es") != -1)
						resposta_retorno = "Seleccione";

					else
						resposta_retorno = "Select";
				}
			}

			return resposta_retorno;
		},

		validar_autocomplete_input(): boolean {
			const validar = ((this.opcoes_select?.length > 0 && this.autocomplete && !this.filterable && this.filtro_busca && String(this.filtro_busca).length > 0) ||
				(this.opcoes_select?.length > 0 && this.autocomplete && this.filterable && this.modelValue));

			if (validar) {
				this.mostrar_opcoes_select_autocomplete = true;
				return true;
			} else {
				this.mostrar_opcoes_select_autocomplete = false;
				return false;
			}
		},

		opcoes_select(): Array<any> {
			let filtro = (this.filterable && this.autocomplete) ? this.modelValue : this.filtro_busca;
			this.posicao_elemento_opcao_ativada_momento_select_autocomplete = 0;
			
			return this.options.filter((d: any) => !filtro || (
				this.keyText ?
				d[this.keyText].toString() :
				d.toString()).toLowerCase().includes(String(filtro).toLowerCase()));
		},

		opcoes_select_inseridas(): Array<object> {
			let resposta_retorno: Array<any> = [];

			if (this.multiple && this.modelValue) {
				if (this.verificarSeDadoEstaArray(this.modelValue)) {
					if (this.getOnlyKeyValue && this.keyValue) {
						// @ts-ignore
						this.modelValue.forEach((dadoModel: any) => {
							// @ts-ignore
							const encontrarValorValorado = this.options.find((dadoOpt: any) => dadoOpt[this.keyValue] == dadoModel);
							if (encontrarValorValorado != undefined) {
								resposta_retorno.push(encontrarValorValorado);
							}
						});
					}
				} else {
					// @ts-ignore
					if (this.keyValue) resposta_retorno = this.options.filter((d: any) => d[this.keyValue] == this.modelValue);
					else resposta_retorno.push(this.modelValue);
				}
			}

			return resposta_retorno;
		},

		MOSTRAR_ICON_CLEARABLE(): boolean {
			return this.clearable && (this.v_model_diferente_que_valores_nullos || this.filtro_busca?.length > 0) && !this.readonly && !this.disabled;
		},
	},

	methods: {
		escutaAoFecharTextFormField() {
			this.mostrar_opcoes_select_autocomplete = false;
		},

		verificarSeDadoEstaArray(valor: any): boolean {
			return Array.isArray(valor);
		},
		verificarSeDadoEstaObjeto(valor: object | any): boolean {
			if (typeof valor === "object") return true;
			else return false;
		},

		verificarItemDesabilitado(index: number): boolean {
			return (this.indexOptionsDisabled.length > 0 && this.indexOptionsDisabled.find((position: number | any) => position == index) != undefined)
				? true : false;
		},

		verificarItemSelecionado(item_momento: any) {
			let resposta_retorno = false;

			if (this.modelValue != null ||
				this.modelValue != undefined ||
				this.modelValue != "") {
				if (this.multiple) {
					if (this.keyValue) {
						if (this.verificarSeDadoEstaArray(this.modelValue)) {
							if (this.getOnlyKeyValue) {
								// @ts-ignore
								this.modelValue.find((dadoModel: any) => dadoModel === item_momento[this.keyValue]) != undefined
									? (resposta_retorno = true)
									: (resposta_retorno = false);
							} else {
								// @ts-ignore
								this.modelValue.find((e: any) => e[this.keyValue] === item_momento[this.keyValue]) != undefined
									? (resposta_retorno = true)
									: (resposta_retorno = false);
							}
						} else {
							resposta_retorno = this.modelValue === item_momento[this.keyValue];
						}
					} else {
						if (this.verificarSeDadoEstaArray(this.modelValue)) {
							// @ts-ignore
							this.modelValue.find((e: any) => e === item_momento) != undefined
								? (resposta_retorno = true)
								: (resposta_retorno = false);
						} else {
							resposta_retorno = this.modelValue === item_momento;
						}
					}
				} else {
					if (this.keyValue) {
						if (this.getOnlyKeyValue) {
							resposta_retorno = this.modelValue == item_momento[this.keyValue];
						} else {
							// @ts-ignore
							resposta_retorno = this.modelValue[this.keyValue] === item_momento[this.keyValue];
						}
					} else {
						resposta_retorno = this.modelValue === item_momento;
					}
				}
			}

			return resposta_retorno;
		},

		verificarItemChecadoRadio(item: object | any): boolean {
			if (this.modelValue != null) {
				// @ts-ignore
				if (this.getOnlyKeyValue && (this.modelValue == item || this.modelValue == item[this.keyValue]))
					return true;

				// @ts-ignore
				else if (this.keyValue && this.modelValue[this.keyValue] == item[this.keyValue])
					return true;

				else if (this.modelValue == item)
					return true;

				else
					return false;
			} else {
				return false;
			}
		},

		tratarCoresClasses(item: any): object {
			return {
				"--selected-default":
					this.verificarItemChecadoRadio(item) && this.color == "default",
				"--selected-primary":
					this.verificarItemChecadoRadio(item) && this.color == "primary",
				"--selected-secondary":
					this.verificarItemChecadoRadio(item) && this.color == "secondary",
			};
		},

		mudaTipoInputTextEPassword() {
			if (this.clone_do_tipo_input == "password") this.clone_do_tipo_input = "text";
			else if (this.clone_do_tipo_input == "text") this.clone_do_tipo_input = "password";
		},

		enviarRespostaInput($event: any, elementoDaAcao: string) {
			if (this.text_form_field_esta_habilitado) {
				if (elementoDaAcao == "input") {
					if (this.onlyNumbers && (new RegExp(/[a-zA-Z]/g).test(String($event.target.value)))) {
						$event.target.value = 0;
					}
					$event.target.value = this.removerEmojisEmInput($event.target.value);

					if (this.autocomplete && !this.filterable) this.filtro_busca = $event.target.value;
					else this.$emit("update:modelValue", $event.target.value);

					this.$emit("onInput", $event.target.value);
					if (this.filterMethod) this.filterMethod($event.target.value);
				} else if (elementoDaAcao == "inputFilterSelect") {
					this.$emit("onInput", $event.target.value);
				} else if (elementoDaAcao == "clickBusca") {
					this.$emit("onClickBusca");
				}
			}
		},

		pressionouEnterEmInput($event: any) {
			if (this.text_form_field_esta_habilitado) this.$emit('onKeyUpEnter', $event);
		},

		limparValorPorClearable() {
			if (this.multiple) this.$emit("update:modelValue", []);
			else this.$emit("update:modelValue", null);

			this.mostrar_opcoes_select_autocomplete = false;
			this.filtro_busca = "";
		},

		armazenandoReferenciasOpcoesSelectAutocomplete(el_li: Ref<any>, index: number, valor_item_momento: any) {
			if (el_li) {
				const elemento: object = {
					el: el_li,
					index,
					valor: valor_item_momento,
				};
				this.ref_opcoes_select_autocomplete[index] = elemento;
			}
		},

		clicouTeclaSelectAutocomplete(seta: string) {
			if ((this.mostrar_opcoes_select_autocomplete) && (this.type == 'select' || this.autocomplete)) {
				let elemento_autocomplete_select_ref: HTMLElement = this.ref_dropdown_select_autocomplete;
				const quant_opcoes_elemento_autocomplete_select = elemento_autocomplete_select_ref.getElementsByTagName("li").length;

				const removerClasseSelected = (posicao: number) => {
					const elemento_momento = this.ref_opcoes_select_autocomplete[this.posicao_elemento_opcao_ativada_momento_select_autocomplete];

					if (!this.verificarItemSelecionado(elemento_momento?.valor)) {
						elemento_autocomplete_select_ref.getElementsByTagName("li")[posicao]?.classList.remove("--selected");
					}
				};

				if (seta == 'up') {
					removerClasseSelected(this.posicao_elemento_opcao_ativada_momento_select_autocomplete);

					if (this.posicao_elemento_opcao_ativada_momento_select_autocomplete == 0) {
						this.posicao_elemento_opcao_ativada_momento_select_autocomplete = quant_opcoes_elemento_autocomplete_select - 1;
					} else {
						this.posicao_elemento_opcao_ativada_momento_select_autocomplete -= 1;
					}
				} else if (seta == 'down') {
					removerClasseSelected(this.posicao_elemento_opcao_ativada_momento_select_autocomplete);
					
					if (this.posicao_elemento_opcao_ativada_momento_select_autocomplete == (quant_opcoes_elemento_autocomplete_select - 1)) {
						this.posicao_elemento_opcao_ativada_momento_select_autocomplete = 0;
					} else {
						this.posicao_elemento_opcao_ativada_momento_select_autocomplete += 1;
					}
				} else if (seta == 'enter') {
					const elemento_momento = this.ref_opcoes_select_autocomplete[this.posicao_elemento_opcao_ativada_momento_select_autocomplete];

					this.selecionouOpcaoSelectAutocomplete(elemento_momento?.valor, elemento_momento?.index);
				}

				const encontra_elemento_na_posicao: HTMLLIElement = elemento_autocomplete_select_ref.getElementsByTagName("li")[this.posicao_elemento_opcao_ativada_momento_select_autocomplete];
				if (encontra_elemento_na_posicao != null && encontra_elemento_na_posicao != undefined) {
					encontra_elemento_na_posicao.classList.add("--selected");

					elemento_autocomplete_select_ref.scroll({
						left: 0, top: encontra_elemento_na_posicao.offsetTop, behavior: 'smooth'
					});
				}
			}
		},

		abrirOuFecharSelectAutocomplete(abrir?: boolean) {
			if (this.text_form_field_esta_habilitado) {
				const validar_abertura_parametro = (abrir != undefined && typeof abrir == 'boolean');

				// @ts-ignore
				this.mostrar_opcoes_select_autocomplete = validar_abertura_parametro ? abrir : !this.mostrar_opcoes_select_autocomplete;
			}
		},

		abrirOpcoesSelectAutocomplete() {
			(this.text_form_field_esta_habilitado) ?
					this.mostrar_opcoes_select_autocomplete = true :
					this.mostrar_opcoes_select_autocomplete = false;
		},

		async selecionouOpcaoSelectAutocomplete(opcao: any, index: number) {
			if (!this.verificarItemDesabilitado(index)) {
				let resposta_retorno: any = null;

				if (this.multiple) {
					if (!this.modelValue) this.$emit("update:modelValue", []);
					resposta_retorno = this.modelValue;

					let encontra_item = undefined;

					if (this.keyValue) {
						if (this.verificarSeDadoEstaArray(resposta_retorno))
							// @ts-ignore
							encontra_item = resposta_retorno.find((e: any) => e === opcao[this.keyValue] || e[this.keyValue] === opcao[this.keyValue]);
						else
							encontra_item = resposta_retorno === opcao[this.keyValue] ? opcao[this.keyValue] : undefined;
					} else {
						encontra_item = resposta_retorno.find((e: any) => e == opcao);
					}

					if (encontra_item != undefined) {
						if (this.verificarSeDadoEstaArray(resposta_retorno))
							resposta_retorno.splice(resposta_retorno.indexOf(encontra_item), 1);
						else resposta_retorno = null;
					} else {
						if (!this.verificarSeDadoEstaArray(resposta_retorno)) resposta_retorno = [];

						// @ts-ignore
						if (this.getOnlyKeyValue) resposta_retorno.push(opcao[this.keyValue]);
						else resposta_retorno.push(opcao);
					}
				} else {
					if (this.getOnlyKeyValue) {
						// @ts-ignore
						resposta_retorno = await opcao[this.keyValue];
					} else {
						resposta_retorno = await opcao;
					}

					this.mostrar_opcoes_select_autocomplete = false;
				}
				
				if (this.autocomplete && !this.filterable) this.filtro_busca = this.keyText ? opcao[this.keyText] : opcao;
				else this.filtro_busca = "";

				if (this.filterMethod) {
					this.filterMethod(resposta_retorno);
				} else {
					this.$emit("onChange", { valor: resposta_retorno, valor_completo: opcao });
					this.$emit("update:modelValue", resposta_retorno);
				}
			}
		},

		removerItem(index: number) {
			let copiaVModel: any = this.modelValue;
			copiaVModel.splice(index, 1);

			this.$emit("update:modelValue", copiaVModel);
		},

		selecionouOpcaoRadio(item: any, index: number) {
			if (!this.verificarItemDesabilitado(index)) {
				// @ts-ignore
				this.$emit("onChange", this.getOnlyKeyValue ? item[this.keyValue] : item);
				// @ts-ignore
				this.$emit("update:modelValue", this.getOnlyKeyValue ? item[this.keyValue] : item);
			}
		},

		removerEmojisEmInput(valor: string) {
			return valor.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
		},
	},
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

$maxWidthMobile: 425px;
$corBranca: #ffffff;
$corBrancaFraco: #f4f4f4;
$corPreta: #000000;
$corAmareloPadrao: #fbbe2f;
$corVerde: #31d0ad;
$corCinzaPadrao: #757575;
$corCinzaClaro: #b1b1b1;
$corCinza: #f2f2f2;
$corBackgroundDesabilitado: #8b8b8b17;
$corBordaDesabilitado: #3838381c;
$corBoxShadow: #2322271a;
$corBoxShadowWebkitScrollBar: #00000080;
$boxShadowSelecionado: inset 0 0 0 3px $corBranca;

@font-face {
    font-family: TextSecurityDisc;
    src: url("../../assets/fonts/TextSecurityDisc.woff");
}

@mixin maxWidthNormal {
	&.--max-width-normal {
		max-width: none;
	}
};

@mixin limiteCaracteres {
	-o-text-overflow: ellipsis;
       text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	pointer-events: none;
};

@mixin naoSelecionarText {
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
};

@mixin tratarPropsBeforeSelectedRadio($cor_aplicar) {
	background-color: $cor_aplicar;
	-webkit-box-shadow: $boxShadowSelecionado;
		box-shadow: $boxShadowSelecionado;
};

@mixin displayFlex {
	display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
};
@mixin displayGrid {
	display: -ms-grid;
	display: grid;
};
@mixin gridTemplateRowsAuto {
	-ms-grid-rows: auto;
		grid-template-rows: auto;
};
@mixin flexDirectionColumn {
	-webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
};
@mixin alignItems {
	-webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
};
@mixin flexWrap {
	-ms-flex-wrap: wrap;
        flex-wrap: wrap;
};
@mixin justifyContentSpaceBetween {
	-webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;
};
@mixin justifyContentCenter {
	-webkit-box-pack: center;
	    -ms-flex-pack: center;
	        justify-content: center;
};
@mixin justifyContentFlexStart {
	-webkit-box-pack: start;
		-ms-flex-pack: start;
			justify-content: flex-start;
};
@mixin justifyContentSpaceAround {
	-ms-flex-pack: distribute;
	    justify-content: space-around;
};
@mixin justifyContentInitialImportant {
	-webkit-box-pack: initial !important;
	    -ms-flex-pack: initial !important;
	        justify-content: initial !important;
};
@mixin transformTranslateY($value) {
	-webkit-transform: translateY($value);
		-ms-transform: translateY($value);
			transform: translateY($value);
};
@mixin transformTranslateX($value) {
	-webkit-transform: translateX($value);
		-ms-transform: translateX($value);
			transform: translateX($value);
};
@mixin borderRadius2RemTop {
	border-radius: 0rem;
	border-top-left-radius: 2.5rem;
	border-top-right-radius: 2.5rem;
};

@mixin aplicarBoxShadowPadrao($x, $y, $blur, $spread, $cor_aplicar) {
	@if $x == none {
		-webkit-box-shadow: none;
			box-shadow: none;
	} @else {
		-webkit-box-shadow: $x $y $blur $spread $cor_aplicar;
			box-shadow: $x $y $blur $spread $cor_aplicar;
	}
};
@mixin aplicarTransition($element, $time, $transition) {
	-webkit-transition: $element $time $transition;
		-o-transition: $element $time $transition;
			transition: $element $time $transition;
};
@mixin aplicarAnimacao($animation_name, $time, $transition) {
	-webkit-animation: $animation_name $time $transition;
		animation: $animation_name $time $transition;
};
@mixin aplicarTransformRotate($value) {
	-webkit-transform: rotate($value);
	    -ms-transform: rotate($value);
	        transform: rotate($value);
};
@mixin aplicarTranformTranslateY($value) {
	-webkit-transform: translateY($value);
	    -ms-transform: translateY($value);
	        transform: translateY($value);
};
@mixin aplicarColumnGap($value_gap) {
	-webkit-column-gap: $value_gap;
	   -moz-column-gap: $value_gap;
	        column-gap: $value_gap;
};

@mixin tratarWebkitScrollBar($largura) {
	scrollbar-color: $corAmareloPadrao $corCinzaClaro !important;
	scrollbar-width: thin !important;

	&::-webkit-scrollbar {
		width: $largura;
		height: 13px;
	}
	&::-webkit-scrollbar-track {
		border: 8px solid #232943;
		-webkit-box-shadow: inset 0 0 2.5px 2px $corBoxShadowWebkitScrollBar;
			box-shadow: inset 0 0 2.5px 2px $corBoxShadowWebkitScrollBar;
	}
	&::-webkit-scrollbar-thumb {
		background: linear-gradient(45deg, $corCinzaClaro, $corAmareloPadrao);
		border-radius: 3px;
	}
}

@mixin estiloIconClearable {
	@include transformTranslateY(-50%);
	background: $corBranca;
	position: absolute;
	top: 50%;
	border-radius: 50%;
	right: 1rem;
	display: none;
	cursor: pointer;
	@include aplicarTransition(transform, .2s, ease);
	&:hover path { fill: $corPreta; }
}

#text-form-field {
	@include displayFlex;
	@include flexDirectionColumn;
	margin: 16px 0px;
	width: 100%;

	font-family: "Montserrat" !important;

	label {
		@include displayFlex;
		@include alignItems;
		@include flexWrap;
		@include justifyContentSpaceBetween;
		margin-bottom: 8px;
		font-style: normal;
		font-weight: normal;
		font-size: 14px;
		line-height: 17px;
		color: $corPreta;

		.label-right { font-weight: 700; }
  	}

	.wrapper__input {
		position: relative;
		max-width: $maxWidthMobile;

		@include maxWidthNormal;

		#input-field {
			@include displayFlex;
			width: 100%;
			position: relative;

			.icon-field {
				@include transformTranslateY(-50%);
				position: absolute;
				top: 50%;
				right: 30px;

				&.--search {
					cursor: pointer;
					background: $corBranca;
					right: 24px;
				}

				&.--disabled { display: none; }
			}

			.svg-icon-clearable { @include estiloIconClearable; }
			&:hover .svg-icon-clearable { @include displayFlex; }

			.input {
				@include displayFlex;
				@include alignItems;
				@include justifyContentCenter;
				@include aplicarBoxShadowPadrao(0px, 1px, 24px, 0px, $corBoxShadow);
				position: relative;
				outline: none;
				width: 100%;
				min-height: 44px;
				padding: 0 20px;
				background: $corBranca;
				border-radius: 40px;
				border: none;
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 17px;
				color: $corPreta;

				&.--text-area {
					border-radius: 8px;
					padding: 12px 24px;
				}

				&.--password-type { padding: 0 70px 0 24px; }

				&.--autocomplete-digit {
					@include aplicarTransition(all, .2s, ease-in-out);
					@include borderRadius2RemTop;
					border: 0.5px solid $corAmareloPadrao;
				}

				&.--webkit-text-security {
					font-family: TextSecurityDisc !important;
					-webkit-text-security: disc;
						-moz-text-security: disc;
				}

				&.--disabled {
					cursor: not-allowed;
					color: $corPreta;
					background-color: $corBackgroundDesabilitado;
					border: 0.1px solid $corBordaDesabilitado;
				}

				@include tratarWebkitScrollBar(8px);
			}
		}
	}

	#dropdown-list__element {
		@include alignItems;
		@include aplicarBoxShadowPadrao(0px, 1px, 24px, 0px, $corBoxShadow);
		position: absolute;
		right: 0px;
		width: 0px;
		background: $corCinza;
		z-index: 1;
		border-radius: 0 0 2.5rem 2.5rem;
		grid-row: auto;
		top: 100%;
		display: none;

		&.autocomplete {
			@include aplicarBoxShadowPadrao(none, 0, 0, 0, none);
			background: $corBranca;
		}

		&.is-active {
			@include displayFlex;
			@include flexDirectionColumn;
			width: 100%;
			max-height: 180px;
			overflow-y: auto;
			z-index: 3;
			border: 1px solid $corPreta;

			&.autocomplete {
				border: 1px solid #e4e7ed;
			}

			@include tratarWebkitScrollBar(4px);
		}

		.dropdown-list__item {
			@include displayFlex;
			@include alignItems;
			@include justifyContentFlexStart;
			padding: 8px 30px;
			width: 100%;
			border-bottom: 1px solid $corPreta;
			cursor: pointer;

			&.--no-data {
				@include justifyContentCenter;
				@include aplicarColumnGap(0.188rem);
				text-decoration: line-through;
				cursor: default;
				border-bottom: 0;
			}

			&.autocomplete {
				border-bottom: none;
				&.--selected {
					background: $corBrancaFraco;
					font-weight: 700;
				}

				&.--disabled {
					cursor: not-allowed;
					color: #808080;
					background: #b3b3b3;
				}

				&:hover:not(.--disabled) { background: $corBrancaFraco; }
			}

			@include naoSelecionarText;

			&.--selected {
				background: $corBranca;
				font-weight: 700;
			}

			&.--disabled {
				cursor: not-allowed;
				color: $corCinzaPadrao;
				background: $corCinza;
			}

			&.--first { border-top: 0px; }
			&.--last { border-bottom: 0px; }

			&:hover:not(.--disabled) { background: $corBrancaFraco; }
		}
	}
	

	#dropdown {
		@include aplicarTransition(border-radius, .2s, ease);
		width: 100%;
		max-width: $maxWidthMobile;
		min-height: 43px;
		height: 100%;
		padding: 0 31.5px;
		position: relative;
		outline: none;
		border-radius: 40px;
		border: 1px solid $corPreta;
		font-size: 14px;

		&.--select-max-width-normal { max-width: none; }

		&.--disabled {
			@include aplicarBoxShadowPadrao(0px, 1px, 24px, 0px, $corBoxShadow);
			cursor: not-allowed;
			color: $corPreta;
			background-color: $corBackgroundDesabilitado;
			border: 0.1px solid $corBordaDesabilitado;

			.inpt-filter,
			#dropdown-select #svg-icon-arrow { cursor: not-allowed; }
		}

		&.is-active {
			@include borderRadius2RemTop;
		}

		&:hover #dropdown-select .svg-icon-clearable {
			@include displayFlex;
		}

		#dropdown-select {
			@include displayFlex;
			@include alignItems;
			@include justifyContentSpaceBetween;
			width: 100%;
			min-height: 43px;
			padding: 10px 0px;
			position: relative;

			#template-filter {
				@include displayFlex;
				@include alignItems;
				@include flexWrap;
				width: calc(100% - 35px);
				gap: 10px;
				line-height: normal;
				white-space: normal;
				z-index: 1;

				.placeholder {
					color: #909090;
					margin-right: 20px;
				}

				.option-inserted {
					@include displayFlex;
					@include alignItems;
					@include aplicarTransition(all, .2s, ease);
					@include aplicarColumnGap(10px);
					@include justifyContentSpaceAround;
					padding: 6px;
					border-radius: 8px;
					background-color: #ffffffb8;

					cursor: default;
					@include limiteCaracteres;
					@include naoSelecionarText;
					@include aplicarBoxShadowPadrao(0px, 0px, 2.5px, 0px, $corBoxShadow);

					.lbl {
						@include limiteCaracteres;
						@include naoSelecionarText;
					}

					.close-x {
						@include displayFlex;
						@include justifyContentCenter;
						width: 10px;
						height: 10px;
						position: relative;
						cursor: pointer;
						pointer-events: auto;

						.arrow {
							@include aplicarTransformRotate(45deg);
							position: absolute;
							width: 1.5px;
							height: 100%;
							background-color: #9c9f9c;
							border-radius: 2px;

							&.--two { @include aplicarTransformRotate(-45deg); }
						}

						&:hover .arrow { background-color: $corPreta; }
					}
				}

				.inpt-filter {
					width: 100% !important;
					height: 100%;
					outline: none;
					border: none;
					width: auto;
					background: transparent;
				}
			}

			#select-label {
				margin-right: 20px;
				@include limiteCaracteres;
			}

			#svg-icon-arrow {
				@include aplicarTransition(transform, .2s, ease);
				position: absolute;
				right: 0px;
				cursor: pointer;

				&.is-active { @include aplicarTransformRotate(90deg); }
			}

			.svg-icon-clearable { @include estiloIconClearable; }
		}
	}

	.container-radio {
		@include displayFlex;
		&.--contains-options {
			@include displayGrid;
			@include gridTemplateRowsAuto;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 5px;
		}
		#id-radio {
			opacity: 0;
			display: none;
			+ .radio-label {
				@include naoSelecionarText;
				&.--selected-default:not(.--disabled) {
					color: $corCinzaPadrao;
					&:before {
						@include tratarPropsBeforeSelectedRadio($corCinzaPadrao);
					}
				}
				&.--selected-primary:not(.--disabled) {
					color: $corAmareloPadrao;
					&:before {
						@include tratarPropsBeforeSelectedRadio($corAmareloPadrao);
					}
				}
				&.--selected-secondary:not(.--disabled) {
					color: $corVerde;
					&:before {
						@include tratarPropsBeforeSelectedRadio($corVerde);
					}
				}
				&:before {
					@include aplicarBoxShadowPadrao(0px, 1px, 4px, 0px, $corBoxShadow);
					@include aplicarTransition(all, .2s, ease);
					content: "";
					background: $corBranca;
					border-radius: 100%;
					display: inline-block;
					width: 1em;
					height: 1em;
					position: relative;
					margin-top: 3px;
					margin-right: 12px;
					vertical-align: top;
					cursor: pointer;
					text-align: center;
				}
			}
			&:focus {
				+ .radio-label {
					&:before {
						outline: none;
						&.--selected-default {
							border-color: $corCinzaPadrao;
						}
						&.--selected-primary {
							border-color: $corAmareloPadrao;
						}
						&.--selected-secondary {
							border-color: $corVerde;
						}
					}
				}
			}
			&.--disabled {
				+ .radio-label {
					color: #a9a9a9;
					background: #f9f9f9;
					border-radius: 8px;
					cursor: not-allowed;
					&::before {
						cursor: not-allowed;
					}
				}
			}
			+ .radio-label {
				&:empty {
					&:before {
						margin-right: 0;
					}
				}
			}
		}
	}

  	.span-msg {
		margin-top: 8px;
		max-width: $maxWidthMobile;
		font-style: normal;
		font-weight: normal;
		font-size: 12px;
		line-height: 17px;
		color: $corCinzaPadrao;

		&.--error { color: #eb5757; }
		&.--max-width { max-width: 100%; }
	}
}

.radio-label { @include justifyContentInitialImportant; }

//Slide:
@keyframes slide-in {
	from { @include aplicarTranformTranslateY(25px); }
	to { @include aplicarTranformTranslateY(0px); }
}
@keyframes slide-out {
	from { @include aplicarTranformTranslateY(0px); }
	to { @include aplicarTranformTranslateY(25px); }
}
.slide-enter-active {
	@include aplicarAnimacao(slide-in, 0.1s, ease);
	@include aplicarTransition(opacity, 0.1s, ease);
}
.slide-leave-active {
	@include aplicarAnimacao(slide-in, 0.1s, ease);
	@include aplicarTransition(opacity, 0.1s, ease);
}
.slide-enter,
.slide-leave-to { opacity: 0; }
.slide-move { @include aplicarTransition(transform, .1s, ease); }

//Slide-Fade:
.slide-fade-enter-active { @include aplicarTransition(all, .1s, ease-out); }
.slide-fade-leave-active { @include aplicarTransition(all, .1s, cubic-bezier(1, 0.5, 0.5, 1)); }
.slide-fade-enter-from,
.slide-fade-leave-to {
	@include transformTranslateX(20px);
	opacity: 0;
}
</style>