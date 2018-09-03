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
    
        function setPhone(phone) {
            this.user.phone = phone;
        },    
        function setToken(token) {
            this.user.token = token;
        },
        function setSocialToken(token) {
            this.user.social_token = token;
        },
        function setEmail(email) {
            this.user.email = email;
        },
        function setPassword(pass) {
            this.user.password = pass;
        },
        function setName(name) {
            this.user.name = name;
        },
        function setProvider(provider) {
            this.user.provider = provider;
        },
        function setUserId(userId) {
            this.user.userId = userId;
        },
        function setImage(image) {
            this.user.profile_image = image;
        },
        function setUser(obj) {
            this.user.phone = obj.phone;
            this.user.token = obj.token;
            this.user.social_token = obj.social_token;
            this.user.email = obj.email;
            this.user.password = obj.password;
            this.user.name = obj.name;
            this.user.provider = obj.provider;
            this.user.userId = obj.userId;
            this.user.profile_image = obj.profile_image;

        },

        function getUser() {
            return 
        }
    };
    