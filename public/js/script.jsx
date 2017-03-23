const endpointUrl = 'http://localhost:8000/teams';

class TeamsList extends React.Component {
    constructor(props) {
        //This allows to acces to the properties this.PROPERTY (In JavaScript classes, you need to explicitly call super(); when defining the constructor of a subclass).
        super(props);

        //When you think of state, you should think of an internal data-set which affects the rendering of components.
        this.state = { team: [], data: {} };

        // This binding is necessary to make 'this' work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    //Called before the render() method
    componentWillMount() {
        this.TeamsList();
    }

    //Gets the list of teams to be rendered
    TeamsList() {
        return $.getJSON(endpointUrl)
            .then((data) => {
                //Set the component's state with the list of teams
                this.setState({ team: data });
            });
    }

    handleClick() {
        var data = this.state.data;
        var team1 = $.trim(data.team1);
        var team2 = $.trim(data.team2);
        var score1 = $.trim(data.score1);
        var score2 = $.trim(data.score2);

        if ((team1 == '' || team1 == '-1') || (team2 == '' || team2 == '-1') || score1 == '' || score2 == ''){
            alert('Invalid option, please enter valid data and try again.');
            return false;
        }

        var team2Score = {
            team : {
                id: team2,
                score: score2
            }
        }

        $.ajax({
            method: "POST",
            data: JSON.stringify(team2Score),
            url: endpointUrl + '/' + team1 + '?score=' + score1,
            contentType: 'application/json'
        }).then((data) => {
            //Reload list
            this.TeamsList();
            //Clear form data and hide modal
            this.setState({ data: { team1: '-1', team2: '-1', score1: '', score2: '' }});
            var $modal = $('.modal').modal('hide');
            $modal.find('input').val('');
            $modal.find('select').val('-1');
        });
    }

    //keeps updated the Component's state with the data entered in the view
    handleChange(propertyName, event) {
        const data = this.state.data;
        data[propertyName] = event.target.value;
        this.setState({ data: data });
    }

    render() {
        //Defined a constant when mapping the list of teams
        const teams = this.state.team.map((item, i) => {
            if (item.id > 0) {
                return (
                    //Each row should have an unique "Key" property (https://facebook.github.io/react/docs/reconciliation.html#keys)
                    <li key={item.id} className="list-group-item">
                        <h4 className="list-group-item-heading">{item.name}</h4>
                        <p className="list-group-item-text">
                            Score: <strong>{item.score}</strong>
                        </p>
                    </li>
                )
            }
        });

        var dropdownItems = this.state.team;
        var addInitItem = true;

        for (var i = 0; i < dropdownItems.length; i++) {
            if (dropdownItems[i].id == '-1') {
                addInitItem = false;
                break;
            }
        }

        if (addInitItem) {
            dropdownItems.unshift({
                id: '-1',
                name: "Select a team"
            });
        }

        const dropdowns = dropdownItems.map((item, i) => {
            return (
                <option value={item.id} key={item.id}>
                    {item.name}
                </option>
            )
        });
        
        return (
            <div>
                <div className="container">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            Teams list
                        </div>
                        <div className="panel-body">
                            <ul className="list-group">
                                { teams }
                            </ul>
                            <a data-toggle="modal" className="btn btn-primary" href="#scores-modal">Add scores</a>
                        </div>
                    </div>
                </div>
                <div className="modal" id="scores-modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 className="modal-title">Add scores</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="team-1" className="control-label">Team 1</label>
                                    <div className="row">
                                        <div className="col-lg-6" id="root-team-1">
                                            <select className="form-control" id="team-1" onChange={ this.handleChange.bind(this, 'team1') }>
                                                { dropdowns }
                                            </select>
                                        </div>
                                        <div className="col-lg-6">
                                            <input type="number" className="form-control" id="score-1" placeholder="Score"
                                                 min="1" onChange={ this.handleChange.bind(this, 'score1') } />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="team-2" className="control-label">Team 2</label>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <select className="form-control" id="team-2" onChange={ this.handleChange.bind(this, 'team2') }>
                                                { dropdowns }
                                            </select>
                                        </div>
                                        <div className="col-lg-6">
                                            <input type="number" className="form-control" id="score-2" placeholder="Score"
                                                min="1" onChange={ this.handleChange.bind(this, 'score2') } />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={ this.handleClick }>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//Finally, it's rendered the code in the DOM (param #1: ComponentName, param #2: The container where the component will be rendered)
ReactDOM.render(
    <TeamsList />, document.getElementById('root')
);