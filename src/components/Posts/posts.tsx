import Vue from 'vue';
import Component from 'vue-class-component';
import { postsResource } from '../../util/resources';
import { Post } from './types';

@Component
export default class Posts extends Vue {

  animation: string = 'flipInX';
  animationDelay: number = 25; // in ms
  posts: Post[] = [];
  postsFilter: string = '';

  /**
   * Computed props
   */
  get filteredPosts() {
    return this.posts.filter((post) => post.title.toLowerCase().indexOf(this.postsFilter.toLowerCase()) !== -1);
  }

  /**
   * Lifecycle-hooks
   */
  mounted() {
    this.fetchPosts();
  }

  /**
   * Custom methods
   */
  async fetchPosts() {
    const { data } = await postsResource.get('/');
    this.posts = data;
  }

  /**
   * Methods for transitions
   */
  handleBeforeEnter(el) {
    el.style.opacity = 0;
    el.classList.add('animated');
  }

  handleEnter(el) {
    const delay = el.dataset.index * this.animationDelay;
    setTimeout(() => {
      el.style.opacity = 1;
      el.classList.add(this.animation);
    }, delay);
  }

  /**
   * Update the filter
   * @param value
   */
  applyFilter({ target: { value } }) {
    this.postsFilter = value;
    return this.posts.filter((post) => post.title.toLowerCase().indexOf(this.postsFilter.toLowerCase()) !== -1);
  }

  render() {

    return (
      <div>
        <h1 class="mb-4"><i class="fa fa-file-text-o"></i> Posts</h1>
        <div class="form-group">
          <input class="form-control" placeholder="Filter posts..." v-model={this.postsFilter} />
        </div>
        <transition-group
          tag="div"
          class="list-group"
          onBeforeEnter={this.handleBeforeEnter}
          onEnter={this.handleEnter}>

          {this.filteredPosts.map((post, index) => (
            <router-link key={post.id}
              class="list-group-item"
              data-index={index}
              to={`post/${post.id}`}>
              {index + 1} {post.title}
            </router-link>
          ))}

        </transition-group>
      </div>
    );
  }
}