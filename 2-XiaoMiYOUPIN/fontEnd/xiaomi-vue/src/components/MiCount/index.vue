<template>
	<div>
		<!--<button v-on:click="decreaseHandler" v-bind:disabled="count === 1">-</button>-->
		<!--<span v-text="count"></span>-->
		<!--<button v-on:click="increaseHandler" v-bind:disabled="count === maxCount">+</button>-->

		<!--<button v-on:click="$emit('decrease')" v-bind:disabled="count === 1">-</button>-->
		<!--<input type="text" v-bind:value="count" v-on:change="inputChange">-->
		<!--<button v-on:click="$emit('increase')" v-bind:disabled="count === maxCount">+</button>-->

		<button v-on:click="$emit('change', count - 1)" v-bind:disabled="count === 1">-</button>
		<input type="text" v-bind:value="count" v-on:change="inputChange">
		<button v-on:click="$emit('change', count + 1)" v-bind:disabled="count === maxCount">+</button>
	</div>
</template>

<script>
	export default {
	        name: 'MiCount',
//		props: ['count', 'maxCount']
		props: {
	                'count': {
	                        requried: true,
		                type: Number
	                },
			'maxCount': {
	                        requried: true,
				type: Number
			},
//			'decreaseHandler': {
//	                        required: true,
//				type: Function
//			},
//			'increaseHandler': {
//	                        required: true,
//				type: Function
//			}
		},
		model: {
	                prop: 'count',
			event: 'change'
		},
		methods: {
	                inputChange(e) {
	                        this.$emit('change', parseInt(e.target.value));
	                }
		}
	};
</script>

<style scoped></style>