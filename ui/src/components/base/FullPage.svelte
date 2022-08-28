<script>
    export let nobranding = false;
</script>

<div class="page-wrapper full-page-panel">
    <div class="flex-fill" />
    <div class="wrapper wrapper-sm m-b-xl">
        {#if !nobranding}
            <div class="block txt-center m-b-lg">
                <span class="txt"><strong>Pterodactyl Market</strong></span>
            </div>
            <div class="clearfix" />
        {/if}
        <slot />
    </div>
    <div class="flex-fill" />
</div>

<style>
    .full-page-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--baseColor);
    }
    .full-page-panel .wrapper {
        animation: slideIn 200ms;
    }
</style>
