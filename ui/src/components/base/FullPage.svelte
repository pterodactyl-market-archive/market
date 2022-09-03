<script>
    import PageWrapper from "@/components/base/PageWrapper.svelte";

    export let nobranding = false;
</script>

<PageWrapper class="full-page" center>
    <div class="wrapper wrapper-sm m-b-xl panel-wrapper">
        {#if !nobranding}
            <div class="block txt-center m-b-lg">
                <figure class="logo">
                    <span class="txt">Pterodactyl <strong>Market</strong></span>
                </figure>
            </div>
            <div class="clearfix" />
        {/if}

        <slot />
    </div>
</PageWrapper>

<style>
    .panel-wrapper {
        animation: slideIn 200ms;
    }
</style>
