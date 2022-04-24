<template>
	<router-view></router-view>
</template>

<script>
	export default {
	        name: 'App'
	};
</script>

<style>
	html, body {
		height: 100%;
		width: 100%;
	}
	/* 单行表单 */
	.search-form .el-form-item__label { max-width: 30%; flex-shrink: 0; }
	.search-form .el-form-item__content { width: 60%; }
	.search-form .el-form-item:last-child .el-form-item__content { width: 100%; }
	.form-inline-search { display: flex; }
	.form-inline-search .el-form-item { width: 25%; display: flex; }
	.form-inline-search .el-form-item label { flex-shrink: 0; }
	.form-inline-search .el-form-item .el-form-item__content { width: 80%; }
	.form-inline-search .el-form-item:last-child .el-form-item__content { width: 100%; display: flex; flex-wrap: nowrap; }
	/* 侧边栏 */
	.el-submenu__title:hover, li.el-submenu li.el-menu-item:hover, li.el-menu-item:hover{ background-color: rgb(0,167,245); }
	li.el-submenu li.el-menu-item:hover>span { color: #eee; }
	.el-submenu__title>i { color: #eee; }
	ul.el-menu--popup li.el-menu-item i, ul.el-menu--popup li.el-menu-item span { color: #333; }
	ul.el-menu--popup li.el-menu-item:hover i, ul.el-menu--popup li.el-menu-item:hover span { color: #eee; }
	/* 树型组件 */
	.custom-tree.el-tree { background: none; font-size: 14px; }
	.custom-tree .el-tree-node { position: relative; padding-left: 16px; }
	.custom-tree .el-tree-node__children { padding-left: 16px; }
	.custom-tree .el-tree-node :last-child:before { height: 38px; }
	.custom-tree .el-tree>.el-tree-node:before { border-left: none; }
	.custom-tree-container .el-tree>.el-tree-node:after { border-top: none; }
	.custom-tree .el-tree-node:before { content: ""; left: -4px; position: absolute; right: auto; border-width: 1px; }
	.custom-tree .el-tree-node:after{ content: ""; left: -4px; position: absolute; right: auto; border-width: 1px; }
	.custom-tree .el-tree-node__expand-icon.is-leaf { display: none; }
	.custom-tree .el-tree-node:before { border-left: 1px dashed #b8b9bb; bottom: 0; height: 100%; top: -20px; width: 1px; }
	.custom-tree .el-tree-node:after { border-top: 1px dashed #b8b9bb; height: 20px; top: 20px; width: 24px; }
	.custom-tree .el-tree-node__content { height: 34px }
	/* 选项卡 */
	.el-tabs { height: 100%; display: flex; flex-direction: column;}
	.el-tabs .el-tabs__header { flex-shrink: 0; }
	.el-tabs .el-tabs__content { flex-grow: 1; overflow: auto; }
	.el-tab-pane { height: 100%; }
	.el-tabs__content::-webkit-scrollbar { height: 0; width: 0; }
	/* 弹窗：仅遮住选项卡部分 */
	.el-dialog__wrapper { position: absolute; background-color: rgba(0,0,0, .3); }
	.el-dialog { margin-top: 5% !important; border-radius: 6px; width: 45%; max-width: 45%; }
	.el-dialog__header { box-sizing: border-box; border-bottom: 1px solid #eee; }
	.el-dialog__title { font-size: 16px; }
	.el-dialog__body { padding: 16px 6px 4px 6px; }
	.el-dialog__body .el-form-item { margin-bottom: 16px; }
	.el-dialog__body .el-form-item__label, .el-input { font-size: 12px; }
	.el-dialog__footer { padding: 0 10px 20px; text-align: center; }
	.dialog-form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 10%;
	}
	.dialog-form .el-select { width: 100%; }
	/* 抽屉 */
	.el-drawer__header { margin-bottom: 10px; }
	.custom-drawer.el-drawer__wrapper { position: absolute; background-color: rgba(0, 0, 0, 0.5); }
	.el-drawer__body::-webkit-scrollbar { display: none; }
	/* 其他 */
	.el-main { padding: 0; }
	.el-main::-webkit-scrollbar { display: none; }
	.imageUpload .el-dialog__body { padding: 20px; }
</style>
