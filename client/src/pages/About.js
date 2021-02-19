import React, { Component } from "react";
import Wrapper from "../components/Wrapper";

class About extends Component {
  render() {
    return (
      <Wrapper>
        <div className="row mx-auto">
          <div className="col-md-9 mx-auto">
            <p className="mx-2 p-2 yellow-text">
              The data (name, year of birth, sex, and number) are from a 100
              percent sample of Social Security card applications for 1880
              onward. It is open data available on data.gov. To safeguard
              privacy, names with fewer than 5 occurrences in any geographic
              area are excluded from our tabulated lists of names.
            </p>
            <p className="mx-2 p-2 yellow-text">
              Unpopular Baby originally started as a python script that parsed
              the Social Security card application data to help us come up with
              a list of possible names for our son, Bryce. It has since morphed
              into a more user friendly and expansive search tool based on
              requests from friends. Happy searching!
            </p>
            <a href="https://play.google.com/store/apps/details?id=com.unpopularbabyapp&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
              <img
                className="img-fluid w-25 mx-auto d-block"
                alt="Get it on Google Play"
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              />
            </a>
          </div>
        </div>
      </Wrapper>
    );
  }
}

export default About;
