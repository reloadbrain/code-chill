import * as React from "react";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import AuthService from "../../AuthService";

export default class UserConnection extends React.Component<any, any> {

    Auth: AuthService;

    constructor(props?: any, context?: any) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
        this.state = {};
    }

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            this.props.history.replace("/");
        }
    }

    render() {
        return (
            <div className="login-form">
                <style>{`
                    body > div,
                    body > div > div,
                    body > div > div > div.login-form {
                        height: 100%;
                    }
                `}</style>
                <Grid
                    textAlign="center"
                    style={{ height: "100%" }}
                    verticalAlign="middle"
                >
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h2" color="teal" textAlign="center">
                            <Image src="logocodeandchill.png" />
                        {" "}Log-in to your account
                        </Header>
                        <Form 
                            size="large"
                            onSubmit={this.handleFormSubmit}
                        >
                            <Segment stacked={true}>
                                <Form.Input
                                    fluid={true}
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="Username"
                                    name="username"
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid={true}
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    onChange={this.handleChange}
                                />

                                <Button 
                                    color="teal"
                                    fluid={true}
                                    size="large"
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            <p>New to us? <a href="/signup">Sign Up</a></p>
                            <p>Forgot your password? <a href="/forgot">Click here</a></p>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>

        );
    }

    private handleChange(e: any) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        );
    }

    private handleFormSubmit(e: any) {
        e.preventDefault();

        this.Auth.login(this.state.username, this.state.password)
        .then((res) => {
            this.props.history.replace("/home");
        })
        .catch((err) => {
            alert(err);
        });
    }

}