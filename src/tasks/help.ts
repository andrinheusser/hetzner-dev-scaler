export default () => {
  console.log(`
    Usage: hds [options] [command]

    Options:

        --verbose               enable verbose logging
    
    Commands:

        help                    Display this help message
        snapshot                Create a snapshot of a your project deployment
        up                      Scale and power up your project deployment
        down                    Power down and scale to minimum costs
        `);
  Deno.exit(0);
};
