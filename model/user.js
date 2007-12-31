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
        address: '',
        date_of_birth: '',
    
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
        setAddress: function (value) {
            this.address = value;
        },
        setDateOfBirth: function (value) {
            this.date_of_birth = value;
        },
        setUser: function (obj) {
            this.phone = obj.phone;
            this.token = obj.token;
            this.social_token = obj.social_token;
            this.email = obj.email;
            this.password = obj.password;
            this.name = obj.name;
            this.provider = obj.provider;
            this.userId = obj.user_id;
            this.profile_image = obj.profile_image;
            this.address = obj.address;
            this.date_of_birth = obj.date_of_birth;
        }
        
    };
    