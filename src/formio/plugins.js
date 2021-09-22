const AddFetchAuth = {
    priority: 0,
    requestOptions: (options, url) => {
        options.credentials = 'include';
        return options;
    },
};

export { AddFetchAuth };
