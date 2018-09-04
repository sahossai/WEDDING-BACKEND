module.exports = {
        phone: '',   
        token: '',
        email: '',
        password: '',
        name: '',
        provider: '',
        userId: '',
        profile_image: '',
        social_token: '',
    
        setPhone: function (value) {
            this.phone = value;
        },    
        setToken: function (value) {
            this.token = value;
        },
        setSocialToken: function (value) {
            this.social_token = value;
        },
        setEmail: function (value) {
            this.email = value;
        },
        setPassword: function (value) {
            this.password = value;
        },
        setName: function (value) {
            this.name = value;
        },
        setProvider: function (providerName) {
            this.provider = providerName;
        },
        setUserId: function (id) {
            this.userId = id;
        },
        setImage: function (image) {
            this.profile_image = image;
        },
        setUser: function (obj) {
            this.phone = obj.phone;
            this.token = obj.token;
            this.social_token = obj.social_token;
            this.email = obj.email;
            this.password = obj.password;
            this.name = obj.name;
            this.provider = obj.provider;
            this.userId = obj.userId;
            this.profile_image = obj.profile_image;
        }
        
    };
    